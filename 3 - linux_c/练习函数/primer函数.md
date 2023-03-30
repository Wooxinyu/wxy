### 函数名字
primer
#### 函数功能
使用多进程的方式计算从 LEFT 到 RIGHT 的质数
每个数字有一个独立的进程计算是否为质数
三个进程交叉拿数计算是否为质数
#### 函数实现
```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#define LEFT 30000000
#define RIGHT 30000200

int main()
{
	int i = LEFT,j = 0;
	int mask;
	pid_t pid;
	for(i = LEFT;i <= RIGHT;i++)
	{
		pid = fork();
		if(pid == 0 )	
		{
			mask = 1;
			for(j = 2;j<i/2;j++)
				if(i%j == 0)
				{
					mask =	0; 
					break;
				}
			if(mask)
				printf("%d is primer \n",i);
			//sleep(10);
			exit(0);
		}
		else if(pid < 0)
		{
			perror("fork():");
		}
	}
	//int st;
	for(i = LEFT;i <+RIGHT;i++)
	{
	//
	//wait(&st);
	wait(NULL);
	}
  // sleep(10);
	exit(0);

}
 
```
---
```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>


#define LEFT 30000000
#define RIGHT 30000200
#define N 3


int main()
{
	int i = LEFT,j = 0,n;
	int mask;
	pid_t pid;
	for(n = 0;n < N;n++)
	{
		pid = fork();
		if(pid < 0)
		{
			perror("fork()");
			wait(NULL);
		}
		if(pid == 0)
		{
		for(i = LEFT+n;i <= RIGHT;i+=N)
		{	
		
				mask = 1;
				for(j = 2;j<i/2;j++)
					if(i%j == 0)
					{
						mask =	0; 
						break;
					}	
				if(mask)
					printf("[%d]:%d is primer \n",n,i);
				//sleep(10);
		}
			exit(0);
		}

	}
	//int st;
	for(i = 0;i < N;n++)
	{
	//wait(&st);
	wait(NULL);
	}
  // sleep(10);
	exit(0);
}
 
```
#### 知识点总结
通过创建多个子进程来判断当前的数字是不是质数，并在该子进程结束后 exit 退出，在 u 父进程中对子进程进行回收。如果子进程结束了但父进程处于睡眠态，子进程还归父进程管但是处于僵尸态。子进程睡了父进程正常结束，子进程会被托付给 init 进程。
三个进程轮流取数进行计算，并在跳出循环后结束进程。