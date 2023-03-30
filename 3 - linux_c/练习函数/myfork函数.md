
### 函数名字
myfork
#### 函数功能

学习和查看 myfork 函数的功能
#### 函数实现
```c
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
int main()
{
	pid_t pid;
	printf("[%d] begin\n",getpid());
	fflush(NULL);
	pid = fork();
	if(pid < 0)
	{
		perror("fork():");
		exit(0);
	}
	else if(pid == 0)
	{
		printf("[%d]:child  is working\n",getpid());
	}
	else 
	{
		sleep(1);
		printf("[%d]:parent is working\n",getpid());

	}

	printf("[%d]: end",getpid());

	exit (0);
}
```
#### 运行结果
```
[11599] begin
[11600]:child  is working
[11600]: end[11599]:parent is working
[11599]: end
```

#### 知识点总结
可以看出在 fork 后，程序出现了两条分支分别沿着父进程与子进程的内容执行。
且执行顺序受调度器控制。
要在 fork 之前使用 fflush ()刷新缓冲区，否则在 fork 时，子进程会复制父进程的缓冲区。
没有在 fork 前刷新缓冲区：
如果输出重定向在文件中，则为全缓冲模式，在系统自行刷新缓冲区时父进程与子进程都会向文件中进行输出。
如果输出在标准输出流中，则为行缓冲，在输出回车时会将缓冲区写入一回，所以在终端上只会看到父进程的一次输出。
因此要在 fork 前刷新缓冲区，避免缓冲区内容也被子进程复制，造成错误。
