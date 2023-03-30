### 函数名字
myshell
#### 函数功能
模仿shell终端，写一个能够读取输入的外部命令并执行
#### 函数实现
```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <glob.h>
#include <sys/wait.h>

#define BUFSIZE 1024
#define DELIMS  "\t\n" 

struct cmd_st
{
    /* data */
    glob_t globres;
};

static void prompt(void)
{
    printf("mysh-0.1$ ");
}        
static int parse(char *line,struct cmd_st * res)
{
    char * tok;
    char flag = 0;
    
    while (1)
    {
    /* code */
    tok = strsep(&line,DELIMS);
    if(tok == NULL)
        break;
    if (tok[0] == '\0')
        continue;

    glob(tok,GLOB_NOCHECK | GLOB_APPEND*flag,NULL,&res->globres);
    flag = 1;
    }
    return 1;
}

int main()
{
    char *linebuf = NULL;
    size_t lintbuf_size = 0;
    struct cmd_st cmd;
    int res;
    __pid_t pid;
    while(1)
    {
        prompt();
        res = getline(&linebuf,&lintbuf_size,stdin);
        if(res < 0)
            break;
        res = parse(linebuf,&cmd);
        pid = fork();
        if(pid < 0)
        {
            perror("fork()");
            exit(1);
        }
        else if(pid == 0)
        {
            printf("%d",pid);
            execvp(cmd.globres.gl_pathv[0],cmd.globres.gl_pathv);
            perror("execvp()");
            exit(1);
        }
        else
        {
            wait(NULL);
        }    
    }    
}  
```


#### 知识点总结
```c
strcmp
可以将输入的字符串按照指定的分隔符分成多个子串
GLOB_NOCHECK
当输入的参数并不是一个pattern时，会将输入的参数直接存放到 glob_t 结构体中
父进程在接收到一个输入后，生成一个子进程来exec输入的外部命令
```