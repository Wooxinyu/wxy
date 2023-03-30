
在 STM 32 F 103 RCT 6 平台编写 IIC 主站程序

STM 32 引脚输入输出模式配置
```
//IO 方向设置
#define SDA_IN ()  {GPIOB->CRL&=0X0FFFFFFF; GPIOB->CRL|=(u32) 8<<28;}
#define SDA_OUT () {GPIOB->CRL&=0X0FFFFFFF; GPIOB->CRL|=(u32) 3<<28;}
```
关于寄存器见手册，位置见 D:\ 嵌入式学习\ STM 32 F 1 中文参考手册


PxIN (n)    PxOUT (n)    
为一个带参宏，本质为一个指向引脚对应寄存器内存的指针，所以可以用