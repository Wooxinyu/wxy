### 函数名字
mydu ()
#### 函数功能

输出你所输入目录或者文件所占用的 K 数。即所占内存大小。
#### 函数实现
```c
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

  warning: ‘strncat’ specified bound 1024 equals destination size [-Wstringop-overflow=]
   41 |  strncat(nextpath,"/*",PATHSIZE);
   
    在使用strncat时，第三个参数需为长度减1，及为最后一位留一个'/0'的位置，否则会报警告。


	忘在mydu函数中为sum赋初值，系统随机为sum赋初值，使最终结果不对。
```


#### 知识点总结
-  递归优化
	尽量缩小要保存的现场内容。如果一个变量的使用时单纯的在递归之前，可以放在静态区使用。
-  如果使用 argv 作为 glob 的输入，需要在输入时添加双引号  
上诉命令中引号是必需的，否则 shell 会将模式展开，也就是只解析输入目录的第一个。
目录中包含的文件为 ./ `*` 的显式文件和./ . `*` 的隐藏文件，但在使用 glob 获取时，./.. 与./. 为上一级目录与当前目录，也会被获取到，因此需要检查获取的目录或文件名是否为上述两种，防止陷入死循环。
使用递归的方式一层层获取每一个目录下的所有文件的内存大小和以及该目录自身文件的大小。
##### stat 函数
 ```c
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
int stat(const char *pathname, struct stat *statbuf);
int lstat(const char *pathname, struct stat *statbuf);

struct stat {
               dev_t     st_dev;         /* ID of device containing file */
               ino_t     st_ino;         /* Inode number */
               mode_t    st_mode;        /* File type and mode */
               nlink_t   st_nlink;       /* Number of hard links */
               uid_t     st_uid;         /* User ID of owner */
               gid_t     st_gid;         /* Group ID of owner */
               dev_t     st_rdev;        /* Device ID (if special file) */
               off_t     st_size;        /* Total size, in bytes */
               blksize_t st_blksize;     /* Block size for filesystem I/O */
               blkcnt_t  st_blocks;      /* Number of 512B blocks allocated */
               struct timespec st_atim;  /* Time of last access */
               struct timespec st_mtim;  /* Time of last modification */
               struct timespec st_ctim;  /* Time of last status change */

      };
返回值为包含文件各种属性的结构体。
stat 与 lstat 的区别在于，对于符号链接，stat得到的是链接到的那个文件的属性，lstat得到的是该符号链接自身的属性。

```
##### glob 函数
```c
#include<glob.h>
Int glob (const char *pattern, int flags,Int (*errfunc) (const char *epath, int eerrno),Glob_t *pglob);
  typedef struct {
               size_t   gl_pathc;    /* Count of paths matched so far  */
               char   **gl_pathv;    /* List of matched pathnames.  */
               size_t   gl_offs;     /* Slots to reserve in gl_pathv.  */
           } glob_t;

pattern 为一个模板，以字符串的形式输入，举例：`*`.c  ,   ./ `*` , ./`*`.c
flag:  GLOB_APPEND
在第二次调用glob时，glob的返回值 *pgblob 会被刷新，使用GLOBAPEND关键字，会将新的结果追加在原先的结果之后
```