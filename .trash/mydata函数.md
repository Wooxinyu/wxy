mydata 函数
```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <string.h>
#define TIMESIZE 1024
#define BUFSIZE 1024
/*
 * 
 * S    second
 * H    HOUR
 * M    MINUSE
 * d    day
 * m    month
 * y    year

*/
int main(int argc,char **argv)
{
	int    a; 
	time_t stamp;
	struct tm * local_time = NULL;
	char timebuf[TIMESIZE];
	char formatbuf[BUFSIZE];
	formatbuf[0] = '\0';
	stamp = time(NULL);
	local_time = localtime(&stamp);
	while(1)
	{
		a = getopt(argc,argv,"SHMdmy");
		if(a<0)
				break;
		switch(a)
		{
			case 'S':
				strncat(formatbuf,"-%S-",BUFSIZE-1);	
				break;
			case 'H':
				strncat(formatbuf,"-%H-",BUFSIZE-1);
				break;
			case 'M':
				strncat(formatbuf,"-%M-",BUFSIZE-1);
				break;
			case 'd':
				strncat(formatbuf,"-%d-",BUFSIZE-1);
				break;
			case 'm':
				strncat(formatbuf,"-%m-",BUFSIZE-1);
				break;
			case 'y':
				strncat(formatbuf,"-%y-",BUFSIZE-1);
				break;
			default:
				break;

		}
	}
	strftime(timebuf,TIMESIZE,formatbuf,local_time);
	puts(timebuf);

	exit(0);
}
```
知识点：
 