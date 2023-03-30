### 函数名字

#### 函数功能


#### 函数实现
```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <string.h>

#define LEFT 5
#define RIGHT 100
#define THREAD_NUM  4

static int num = 0;
static  pthread_mutex_t mutex_num = PTHREAD_MUTEX_INITIALIZER;

static void * thr_primer(void *p);

int main()
{
    int i,err;
    pthread_t tid[THREAD_NUM];
    for(i = 0;i< THREAD_NUM; i++)
    {
        err = pthread_create(tid+i,NULL,thr_primer,(void *)i);
        if(err)
        {
            fprintf(stderr,"pthread_create():%s\n",strerror(err));
            exit(1);
        }
    }
    for(i = LEFT; i <= RIGHT; i++)
    {

        pthread_mutex_lock(&mutex_num);
        while(num != 0)
        {
            pthread_mutex_unlock(&mutex_num);
            sched_yield();     // 
            pthread_mutex_lock(&mutex_num);
        }
        printf("%d,:%d\n",__LINE__,i);
        num = i;
        pthread_mutex_unlock(&mutex_num);
        sched_yield();
    }
    pthread_mutex_lock(&mutex_num);
    while(num != 0)
    {
        pthread_mutex_unlock(&mutex_num);
        sched_yield();
        pthread_mutex_lock(&mutex_num);
    }
    num = -1;
    pthread_mutex_unlock(&mutex_num);
    for(i = 0;i < THREAD_NUM; i++)
        pthread_join(tid[i],NULL);
    pthread_mutex_destroy(&mutex_num);
    exit(0);
}
static void * thr_primer(void *p)
{
    int i, j, mark;
    while(1)
    {
        pthread_mutex_lock(&mutex_num);
        while(num == 0)
        {
            pthread_mutex_unlock(&mutex_num);
            sched_yield();     // 
            pthread_mutex_lock(&mutex_num);
       }
        if(num == -1)
        {
            pthread_mutex_unlock(&mutex_num);
            break;
        }
        i = num;
        printf("%d,:%d\n",__LINE__,i);
        num = 0;
        mark = 1;
        pthread_mutex_unlock(&mutex_num);
        for(j = 2; j <= i/2; j++)
        {
            if(i%j == 0)
            {
                mark = 0;
                break;
            }
        }
        if(mark)
            printf("%d is primer\n",i);
    }
    pthread_exit(NULL);
    return NULL;
}
```


#### 知识点总结
