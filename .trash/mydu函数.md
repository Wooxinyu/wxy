mydu函数编写

功能，输出目录或文件的大小占多少k，即st_block/2数。
在传入参数为文件时返回文件的st_blocks 值
在传入参数为目录时采用递归的方式获取该目录下所有的文件大小之和，加上目录文件本身的大小后返回
由于glob函数得到的路径gl_pathv包括当前路径和上一层路径，所以在递归前要进行判断，防止进入循环，无法递归结束。
```
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <glob.h>
#include <string.h>
#define PATHSIZE  1024


static int path_noloop(const char * pathname)
{
	char * pos;
	pos = strrchr(pathname,'/');
	if(pos == NULL)
			exit(1);
	if((strcmp(pos+1,".") == 0) || (strcmp(pos+1,"..") == 0) )
		return 0;

	return 1; 


}

static int64_t mydu(const char *path)
{
	struct stat statbuf;
	glob_t globres;
	char nextpath[PATHSIZE];
	int64_t sum =0 ;
	int i;
	if(lstat(path,&statbuf) < 0 )
	{
		perror("lstat()");
		exit(1);
	}
	if(!S_ISDIR(statbuf.st_mode))
		return (statbuf.st_blocks);
			
	strncpy(nextpath,path,PATHSIZE);
	strncat(nextpath,"/*",PATHSIZE-1);
	glob(nextpath,0,NULL,&globres);

	strncpy(nextpath,path,PATHSIZE);
	strncat(nextpath,"/.*",PATHSIZE-1);
	glob(nextpath,GLOB_APPEND,NULL,&globres);

	for(i = 0;i < globres.gl_pathc;i++)
	{
		if(path_noloop(globres.gl_pathv[i]))
			sum+= mydu(globres.gl_pathv[i]); 
	} 
	sum +=statbuf.st_blocks;
	return sum;

}

int main(int argc,char **argv)
{
	if(argc < 2 )
	{
		fprintf(stderr,"Usage...\n");
		exit(1);
	}
	glob_t  globres;	
	int i = 0;
	struct stat statbuf;
	glob(argv[1],0,NULL,&globres);
	for(i = 0;i< globres.gl_pathc;i++)
	{
		printf("%ld\n",mydu(globres.gl_pathv[i])/2);
			

	}
	 exit(0);

}

错误警告：
```
```
  warning: ‘strncat’ specified bound 1024 equals destination size [-Wstringop-overflow=]
   41 |  strncat(nextpath,"/*",PATHSIZE);
   在使用strncat时，第三个参数需为长度减1，及为最后一位留一个'/0'的位置，否则会报警告。


	忘在mydu函数中为sum赋初值，系统随机为sum赋初值，使最终结果不对。

```

递归优化
尽量缩小要保存的现场内容 。如果一个变量的使用时单纯的在递归之前，可以放在静态区使用。

globtset
如果使用 argv 作为 glob 的输入，需要在输入时添加双引号  
上诉命令中引号是必需的，否则shell会将模式展开，也就是只解析输入目录的第一个.
```
 #include <stdio.h>
 #include <stdlib.h>
 #include <sys/types.h>
 #include <sys/stat.h>
 #include <unistd.h>
 #include <glob.h>
 #include <string.h>


int main(int argc,char **argv )
{
	glob_t globres;
	int i;
	glob(argv[1],0,NULL,&globres);
	printf("%ld\n",globres.gl_pathc);
	for(i = 0;i < globres.gl_pathc; i++)
		puts(globres.gl_pathv[i]);
	return 0;
}
```

 myls函数
