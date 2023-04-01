### 函数名字
anytimer.c
#### 函数功能
实现多个定时器
#### 函数实现
```c
/*anytimer.c*/
#include "anytimer.h"

typedef struct job_st
{
    int sec;
    void (* func)(char *);
    char *argv;
    char flag;
}job;

job job_buf[JOB_MAX];

int at_addjob(int sec,at_jobfunc_t *jobp ,void *arg)
{
    int i = 0;
    
    job_buf[i].sec = sec;
    job_buf[i].func = jobp;
    job_buf[i].argv =arg;
    job_buf[i].flag = RUNNING;

}


/*anytimer.h*/
#ifndef ANYTIMER_H__
#define ANYTIMER_H__
typedef void at_jobfunc_t(void*);

#define JOB_MAX
#define RUNNING 1
#define DEAD   0
/*
* return 0 成功
*/
int  at_addjob(int sec,at_jobfunc_t *jobp ,void *arg); 
int at_cancel_job(int id);
/**
 *    return == 0 成功
 *          == -EINVAL 失败，参数非法
 *          == -EBUSY   失败，指定人物已完成
 *          ==  
*/
int at_waitjob(int id);
/**
 *   return 0 成功释放
 *          -INVAL  失败,参数非法
 *          
 * /
#endif // !ANYTIMER_H_


/*main.c*/
#include "anytimer.h"
#include "stdio.h"
#include "stdlib.h"
#include "signal.h"

static void f1(char *s)
{
    printf("%s:%s\n",__FUNCTION__,s);
}

static void f2(char *s)
{
    printf("%s:%s\n",__FUNCTION__,s);
}

int main()
{
    int job1,job2,job3;
    puts("Begin!\n");
    job1 = at_addjob(5,f1,"aaa");
    if(job1 < 0)
    {
        fprinf(stderr,"at_addjob():%s");
    }
    at_addjob(2,f2,"bbb");
    at_addjob(7,f1,"ccc");


}


```


#### 知识点总结
