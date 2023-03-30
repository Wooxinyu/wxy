### 函数名字
primer.c
#### 函数功能
使用多线程的方式求一段范围内的素数

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

static void * thr_primer(void *p);

int main()
{
    int i,err;
    pthread_t tid[THREAD_NUM];
    for(i = LEFT;i<=RIGHT;i++)
    {
        err = pthread_create(tid+(i-LEFT),NULL,thr_primer,&i);
        if(err)
		{ fprintf(stderr,
		"pthread_create():%s\n"
		,strerror(err));
		exit(1);
        }
    }
    for(i = LEFT;i <= RIGHT; i++)
        pthread_join(tid[i-LEFT],NULL);
    
    exit(0);
}
static void * thr_primer(void *p)
{
    int i=0, j, mark = 1;
    i = *(int*)p;
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
    pthread_exit(NULL);
    return NULL;
}
```


#### 知识点总结
在创建线程传参时使用的是地址传参，即传入的是一个地址，在该线程接收到这个地址内的值之前，这个地址内的值发生了变化的话，线程接受到的值也会变化，就会产生错误
解决方法1：使用强制转换，将值转换成地址进行传递，在线程内再使用强制转换获取到值。
解决方法2：每次传参前都开一个内存接收要传的值，在进行地址传参。在线程结束后将地址返回，在等待线程结束的部分对申请的内存进行释放。