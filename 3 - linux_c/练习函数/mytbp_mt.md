### 函数名字
mytbf_mt.c
#### 函数功能

以线程的方式实现令牌桶。
创建一个线程负责每隔一秒向每个桶内的各个job增加CPS个令牌。
init函数可以初始化一个令牌桶，令牌桶包含以下几个元素：最大令牌数，每次获取令牌数，当前令牌数，以及一个互斥信号量。通过令牌桶的方式实现io输出的流量控制。
#### 函数实现
```c
/*mytbf.h*/
#ifndef MYTBF_H__
#define MYTBF_H__

#define MYTBF_MAX 1024
#define CPS 10
#define BRUST 100
#define BUFSIZE 64
typedef void mytbf_t;
 mytbf_t * mytbf_init(int cps,int burst);

int mytbf_fetchtoken(mytbf_t *,int );

int mytbf_returntoken(mytbf_t *,int);

int mytbf_destory(mytbf_t *);
#endif

/*mytbf.c*/
#include "mytbf.h"
#include "stdio.h"
#include "stdlib.h"
#include "errno.h"
#include <string.h>
#include "unistd.h"
#include <sys/time.h>
#include <pthread.h>
static struct mytbf_st * job[MYTBF_MAX];

static pthread_mutex_t mut_job = PTHREAD_MUTEX_INITIALIZER;


static char inited = 0;
static   pthread_t tid_alrm;
static pthread_once_t init_once = PTHREAD_ONCE_INIT;
struct mytbf_st
{
    int cps;
    int brust;
    int token;
    int pos;
    pthread_mutex_t mut_token ;
};
static int min(int a,int b)
{
    return (a<b?a:b);
}

static void *thr_alrm(void *p)
{
    while(1)
    {
        pthread_mutex_lock(&mut_job);
        for(int i = 0; i< MYTBF_MAX;i++)
        {
            if(job[i] )//！= NULL)
            {
                pthread_mutex_lock(&job[i]->mut_token);
                job[i]->token +=job[i]->cps;
                if(job[i]->token > job[i]->brust)
                    job[i]->token = job[i]->brust;     
                pthread_mutex_unlock(&job[i]->mut_token);          
            }
        }
        pthread_mutex_unlock(&mut_job);
        sleep(1);
    }

}

/*
**应该加锁却没有加锁，需要在函数名上体现出来
*/
static int get_free_pos_unlocked(void)
{

    for(int i = 0;i<MYTBF_MAX; i++)
    {
        if(job[i] == NULL)
        return i;
    }
    return -1;
}
static void moudle_unload(void)
{
    pthread_cancel(tid_alrm);
    pthread_join(tid_alrm,NULL);
    for(int i =0;i<MYTBF_MAX;i++)
    {
        if(job[i])
        {
            mytbf_destory(job[i]);
        }   
    }    
    pthread_mutex_destroy(&mut_job);

}

static void moudel_load()
{
    int err;
    err = pthread_create(&tid_alrm,NULL,thr_alrm,NULL);
    if(err)
    {
        fprintf(stderr,"pthread_create()%s",strerror(err));
        exit(1);
    }
    atexit(&moudle_unload);
}

mytbf_t * mytbf_init(int cps,int burst)
{
    int pos;
    struct mytbf_st * me;
    pthread_once(&init_once,moudel_load);
    me = malloc(sizeof(*me));
    if(me == NULL)
        return NULL;
    else
    {
        me->cps = cps;
        me->brust = burst;
        me->token = 0; 
        pthread_mutex_init(&me->mut_token,NULL);
    }
    
    pthread_mutex_lock(&mut_job);
    pos = get_free_pos_unlocked();
    if(pos < 0)
    {
        pthread_mutex_unlock(&mut_job);
        free(me);
        return NULL;
    }
    else 
    {
        me->pos = pos;
        job[pos] = me;
    }
    pthread_mutex_unlock(&mut_job);
    return me;
    
}

int mytbf_fetchtoken(mytbf_t *ptr,int size)
{
    struct mytbf_st *me = ptr;
    int n;
    if(size <= 0)
        return -EINVAL;
    pthread_mutex_lock(&me->mut_token);
    while(me ->token <= 0)
    {
        pthread_mutex_unlock(&me->mut_token);
        sched_yield();
        pthread_mutex_lock(&me->mut_token);
    }
    n = min(me->token,size);
    me->token -= n;
    pthread_mutex_unlock(&me->mut_token);

}

int mytbf_returntoken(mytbf_t * ptr,int size)
{
    struct mytbf_st *me = ptr;    
    if(size <= 0)
        return -EINVAL;
    pthread_mutex_lock(&me->mut_token);
    me->token += size;
    if(me->token > me->brust)
    {
        me->token = me->brust;
    }
     pthread_mutex_unlock(&me->mut_token);
    return size;
    
    
}

int mytbf_destory(mytbf_t *ptr)
{
    struct mytbf_st *me;
    me = ptr;
    pthread_mutex_destroy(&me->mut_token);
    pthread_mutex_lock(&mut_job);
    job[me-> pos] = NULL;
    pthread_mutex_unlock(&mut_job);
    free(me);
    return 0;
}

/*main.c*/
#include "mytbf.h"
#include "stdio.h"
#include "stdlib.h"
#include "sys/time.h"
#include <signal.h>
#include <errno.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>

int main(int argc, char **argv)
{
    mytbf_t *tbf;
    tbf = mytbf_init(CPS,BRUST);
    int sfd,dfd=1;
    char buf[BUFSIZE];
    int len,ret,pos,size;
    if(argc < 2)
    {
        perror("Usage ...");
        exit(0);
    }
    do
    {
        sfd = open(argv[1],O_RDONLY);
        if(sfd < 0 )
        {
            if(errno != EINTR)
            {
              perror("sopen()");
             exit(1);
            }
         }
    } while (sfd<0);
      
   
    while(1)
    {
        size = mytbf_fetchtoken(tbf,BUFSIZE);
        if(size < 0)
        {   
            fprintf(stderr,"mytbf_fetchtoken():%s\n",strerror(-size));
           // exit(0);
        }
        len = read(sfd,buf,BUFSIZE);
        if(len < 0)
        {
            if(errno == EINTR)
                continue;
            perror("read()");
            break;
        }
        if(len ==0)
            break;
        if(size -len >0)
            mytbf_returntoken(tbf,size - len);

        pos = 0;
        while(len > 0)
        {
            ret = write(1,buf+pos,len);
            if(ret < 0)
            {
                if(errno == EINTR)
                    continue;
                perror("write()");
                exit(1);
            }
            pos += ret;
            len -= ret;
        }
    }    
    close(sfd);
    mytbf_destory(tbf); 
    exit(0);

}
/*makefile*/

ALL:mytbf

mytbf:main.o  mytbf_mt.o
	gcc $^ -o $@ $(CFLAGS) $(LDFLAGS)


clean:
	rm -rf *.o mytbf

```


#### 知识点总结
	
当一个函数可能被执行多次但有一段代码只需要第一次调用执行时，可以将其封成一个pthread_onde_t线程，通过pthread_once函数对其创建。该线程会在运行一次后死亡。

该程序中，存在可能被多个函数访问的变量，在对其操作时需要通过上锁解锁的操作来保证操作的原子性，以防止在操作中被别的线程插入导致错误。

对于临界区内部的函数跳转要注意，该函数最好也是非重入函数，否则可能会导致死锁。对不能放进临界区的函数最好在命名时以unlocked结尾，表明这个函数应该加锁却没有加锁。
