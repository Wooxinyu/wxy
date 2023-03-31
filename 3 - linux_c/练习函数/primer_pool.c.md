### 函数名字
 primer_pool.c
#### 函数功能
采用线程池的思想，通过对一个公共资源上锁解锁，一个上游线程负责投递数字，四个下游线程负责抢数字，实现一段区间内的质数运算。
其中，num = 0时，表示数字已经被下游线程取到，上游线程可以前进到下一个数字。num = -1 时所有数字均已计算完成，下游线程结束，上游线程收尸。

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
上游线程循环等待num !=0 ，此时num已经变成别的数，上游线程不断循环解锁，让出核执行权，上锁，以等待下游线程可以在让出执行权时得到锁，对num进行运算。如果num为0则对其进行赋值，使其为下一个要运算的数据。在赋值循环结束后， 要再一次判断num是否为0，即有一个线程将最后一个数成功取走了，最后对num赋值-1，提醒其他线程可以结束了，开始等待收尸。

下游线程循环检测num是否为0，如果为0则不断解锁，让出执行权，上锁，期望上游线程可以得到锁对num进行修改。如果不为0则将数字获取后，解锁进行质数运算。之后循环等待锁的到来，在获取到num为-1后进行退出。在判断num值时是上锁的状态，因此要将锁解开后在推出。
要保证各个线程对num的操作都是处于上锁状态下的，这样才可以保证操作num时不会发生冲突。