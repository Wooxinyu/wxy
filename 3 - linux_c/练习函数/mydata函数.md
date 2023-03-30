### 函数名字
mydata
#### 函数功能
在控制端输出当前时间
opt： -S , -H ，-M , -d, -m， -y
#### 函数实现
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
		a = getopt(argc,argv,"SH:Mdmy:");
		if(a<0)
				break;
		switch(a)
		{
			case 'S':
				strncat(formatbuf,"-%S-",BUFSIZE-1);	
				break;
			case 'H':
				if(strcmp(optarg,"12") == 0)
					strncat(formatbuf,"%I(%P)",BUFSIZE-1);
				else if(strcmp(optarg,"24") == 0)
					strncat(formatbuf,"%H",BUFSIZE-1);
				else
					fprintf(stderr,"H:");

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
				if(strcmp(optarg,"2") == 0)
						strncat(formatbuf,"%y",BUFSIZE-1);
				else
					strncat(formatbuf,"-%Y-",BUFSIZE-1);
				break;
			default:
				break;

		}
	}
	strftime(timebuf,TIMESIZE,formatbuf,local_time);
	puts(timebuf);

	exit(0);
}```


#### 知识点总结
```c
#include <time.h>
time_t time(time_t *tloc);
返回一个 time_t 类型的值，该值为从1970-01-01 00：00：00 到现在经历的秒数。

struct tm *localtime(const time_t *timep);
           struct tm {
               int tm_sec;    /* Seconds (0-60) */
               int tm_min;    /* Minutes (0-59) */
               int tm_hour;   /* Hours (0-23) */
               int tm_mday;   /* Day of the month (1-31) */
               int tm_mon;    /* Month (0-11) */
               int tm_year;   /* Year - 1900 */
               int tm_wday;   /* Day of the week (0-6, Sunday = 0) */
               int tm_yday;   /* Day in the year (0-365, 1 Jan = 0) */
               int tm_isdst;  /* Daylight saving time */
           };
localtime 函数将 time_t 类型的值转化为我们常见的年月日时分秒等信息。参数为 time_t 变量的地址。
getopt

 #include <unistd.h>
int getopt(int argc, char * const argv[], const char *optstring);
extern char *optarg;

   从传入的argv中依次解析为optstring中的哪一个，并返回，若没有则返回负值。
 optarg 是用来描述opt即指令的参数的，在需要描述的opt后面加：表示，在传参的时候要紧跟着opt
 optind 表示已经读到了argv中的哪一个下标
 
```