### 函数名字
mytbp_sig.c
#### 函数功能
通过令牌桶的方式，使程序缓慢读取文件中的字符并打印在终端上。桶每隔一段时间会获取一定数量的令牌，程序在获得令牌后可以获取并打印令牌数量的字符。没有用完的令牌会返回到桶中。

#### 函数实现
```c
/*mytbf.c*/

#include "mytbf.h"
#include "stdio.h"
#include "stdlib.h"
#include "errno.h"
#include <signal.h>
#include "unistd.h"
#include <sys/time.h>

static struct mytbf_st * job[MYTBF_MAX];


static char inited = 0;
static __sighandler_t oldhandler;
struct mytbf_st
{
    int cps;
    int brust;
    int token;
    int pos;
};
static int min(int a,int b)
{
    return (a<b?a:b);
}
static void alarm_handler(int s)
{
    struct itimerval itv;
    itv.it_value.tv_sec = 1;
    itv.it_value.tv_usec = 0;
    itv.it_interval.tv_sec = 1;
    itv.it_interval.tv_usec = 0;
    setitimer(ITIMER_REAL,&itv,NULL);
    for(int i = 0; i< MYTBF_MAX;i++)
    {
        if(job[i] )//！= NULL)
        {
            job[i]->token +=job[i]->cps;
            if(job[i]->token > job[i]->brust)
                job[i]->token = job[i]->brust;               
        }
    }


}
static int get_free_pos(void)
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
    struct itimerval itv;
    itv.it_value.tv_sec = 0;
    itv.it_value.tv_usec = 0;
    itv.it_interval.tv_sec = 0;
    itv.it_interval.tv_usec = 0;
    setitimer(ITIMER_REAL,&itv,NULL);
    signal(SIGALRM,oldhandler);
    for(int i =0;i<MYTBF_MAX;i++)
        free(job[i]);
}

static void moudel_load()
{
    oldhandler = signal(SIGALRM,alarm_handler);
    struct itimerval itv;
    itv.it_value.tv_sec = 1;
    itv.it_value.tv_usec = 0;
    itv.it_interval.tv_sec = 1;
    itv.it_interval.tv_usec = 0;
    setitimer(ITIMER_REAL,&itv,NULL);
    atexit(&moudle_unload);
}

mytbf_t * mytbf_init(int cps,int burst)
{
    int pos;
    struct mytbf_st * me;
    if(!inited)
    {
        moudel_load();
    }
    pos = get_free_pos();
    if(pos < 0)
        return NULL;
    me = malloc(sizeof(*me));
    if(me == NULL)
        return NULL;
    else 
    {
        me->cps = cps;
        me->brust = burst;
        me->token = 0;
        me->pos = pos;
        job[pos] = me;
    }
    return me;
    
}

int mytbf_fetchtoken(mytbf_t *ptr,int size)
{
    struct mytbf_st *me = ptr;
    int n;
    if(size <= 0)
        return -EINVAL;
    while(me ->token <= 0)
    {
        pause();
    }
    n = min(me->token,size);
    me->token -= n;

}

int mytbf_returntoken(mytbf_t * ptr,int size)
{
    struct mytbf_st *me = ptr;    
    if(size <= 0)
        return -EINVAL;
    me->token += size;
    if(me->token > me->brust)
    {
        me->token = me->brust;
    }
    return size;
    
    
}

int mytbf_destory(mytbf_t *ptr)
{
    struct mytbf_st *me;
    me = ptr;
    job[me-> pos] = NULL;
    free(me);
    return 0;
}

/*mytbf.h*/
_MAX 1024
#define CPS 10
#define BRUST 100

typedef void mytbf_t;
 mytbf_t * mytbf_init(int cps,int burst);

int mytbf_fetchtoken(mytbf_t *,int );

int mytbf_returntoken(mytbf_t *,int);

int mytbf_destory(mytbf_t *);
#endif

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
```


#### 知识点总结
