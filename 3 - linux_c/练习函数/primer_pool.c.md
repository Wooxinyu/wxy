### 函数名字

#### 函数功能


#### 函数实现
```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <string.h>

#define LEFT 3000000
#define RIGHT 3000200
#define THREAD_NUM  (RIGHT-LEFT+1)

static int num = 0;
static pthread_mutex_t mutex_num = PTHREAD_MUTEX_INITIALIZER;

static void * thr_primer(void *p);

int main()
{
    int i,err;
    pthread_t tid[THREAD_NUM];
    for(i = 0;i< THREAD_NUM; i++)
    {
        err = pthread_create(tid+i,NULL,thr_primer,&i);
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
        num = i;
        pthread_mutex_unlock(&mutex_num);
    }
    num = -1;
    for(i = 0;i < THREAD_NUM; i++)
        pthread_join(tid[i],NULL);
    pthread_mutex_destroy(&mutex_num);
    exit(0);
}
static void * thr_primer(void *p)
{
    int i, j, mark = 1;
    while(1){
        
        pthread_mutex_lock(&mutex_num);
         while(num == 0)
        {
            pthread_mutex_unlock(&mutex_num);
            sched_yield();     // 
            pthread_mutex_lock(&mutex_num);
       }
        i = num;
        if(num == -1)
        {
        pthread_mutex_unlock(&mutex_num);
        break;
        }
        num = 0;
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
