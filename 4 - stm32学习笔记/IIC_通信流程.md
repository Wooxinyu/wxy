
## IIC 通信流程

IIC 在进行通信时，由于需要配置设备寄存器与读设备寄存器中的值的原因，整体通信流程并没有那么单一简单，具体流程如下。
理论参考： https://blog.csdn.net/weixin_56912944/article/details/125823285
程序参考：D:\ BaiduNetdiskDownload\ C8T6+mpu6050简单读取
### 主机读取从机寄存器
 
1、主机发送起始信号
2、主机发送从机地址与数据传输方向
由于 IIC 一次传输一个字节 8 个位，所以一般从站的地址是七位，在发送器件地址时将从机地址向左移动一位后与上 R/W 非作为地址字节发送，并等待从站的响应信号。
由于主站第一次是向从站发送写命令，写寄存器的地址，所以第一次发送地址时为写。
3、如果读写设备的寄存器，则发送需要读写的设备寄存器地址。并等待从站的响应信号。
4、再次产生 start 信号!!!!
5、再一次发送器件地址，等待从站的响应信号。
6、读取一个字节的数据，发送一个应答信号
7、循环 6，直到数据读取结束。最后一个字节读取后无应答信号。
8、发送停止信号。

#### 程序
第一次发送地址时为写操作，然后发送所要读取的寄存器地址。
第二次发送从机地址时才发送读命令，读取寄存器中的数据。

```c
/**************************实现函数********************************************
*函数原型:		unsigned char I2C_ReadOneByte(unsigned char I2C_Addr,unsigned char addr)
*功　　能:	    读取指定设备 指定寄存器的一个值
输入	I2C_Addr  目标设备地址
		addr	   寄存器地址
返回   读出来的值
*******************************************************************************/ 
unsigned char I2C_ReadOneByte(unsigned char I2C_Addr,unsigned char addr)
{
	unsigned char res=0;
	
	IIC_Start();	
	IIC_Send_Byte(I2C_Addr);	   //发送写命令
	res++;
	IIC_Wait_Ack();
	IIC_Send_Byte(addr); res++;  //发送地址
	IIC_Wait_Ack();	  
	//IIC_Stop();//产生一个停止条件	
	IIC_Start();
	IIC_Send_Byte(I2C_Addr+1); res++;          //进入接收模式			   
	IIC_Wait_Ack();
	res=IIC_Read_Byte(0);	   
    IIC_Stop();//产生一个停止条件

	return res;
}
```
### 主机写入数据
1、产生起始信号
2、发送从机设备地址，最后一位为 0 表示写入。等待从机应答。
3、发送所要写入的寄存器的地址高位与低位。
4、发送数据。
5、发送结束信号。

#### 程序
```c
/**************************实现函数********************************************
*函数原型:		u8 IICwriteBytes(u8 dev, u8 reg, u8 length, u8* data)
*功　　能:	    将多个字节写入指定设备 指定寄存器
输入	dev  目标设备地址
		reg	  寄存器地址
		length 要写的字节数
		*data  将要写的数据的首地址
返回   返回是否成功
*******************************************************************************/ 
u8 IICwriteBytes(u8 dev, u8 reg, u8 length, u8* data){
  
 	u8 count = 0;
	IIC_Start();
	IIC_Send_Byte(dev);	   //发送写命令
	IIC_Wait_Ack();
	IIC_Send_Byte(reg);   //发送地址
    IIC_Wait_Ack();	  
	for(count=0;count<length;count++){
		IIC_Send_Byte(data[count]); 
		IIC_Wait_Ack(); 
	 }
	IIC_Stop();//产生一个停止条件

    return 1; //status == 0;
}


```

