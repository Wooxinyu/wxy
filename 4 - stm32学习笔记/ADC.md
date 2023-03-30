### 结构
![](ADC_image_1.png)
ADC输入可以进入规则通道或者注入通道，规则通道能支持16个通道，但只有一个寄存器存储DC转换的值，注入通道只支持4个通道输入但可以存储4个转换值。模拟看门狗可以在输入电压超出参考电压的范围时触发中断。ADC_RCC由APB2分频得到
### 模式
单次转换，非扫描模式
![](ADC_image_2.png)
单次转换：一次只能触发一回，不能连续转换
非扫描：一次只能一个通道，即序列中只能有一个通道
连续转换，非扫描模式
![](ADC_image_3.png)
单次转换，扫描模式
![](ADC_image_4.png)
连续转换，扫描模式
![](ADC_image_5.png)
间断模式：在转换了几个通道会停下来，再次触发才能继续。
### 触发源
![](ADC_image_6%201.png)
ADC可以通过外部事件触发，也可以内部软件触发。
#### 软件触发
ADC_CR2寄存器中的SWSTART位，开启规则组转换，JSWSTART，开启注入组转换
库函数中`ADC_SoftwareStartInjectedConvCmd`,`ADC_SoftwareStartConvCmd`分别为注入组与规则组软件触发的函数
### 
•建议在每次上电后执行一次校准
•启动校准前， ADC必须处于关电状态超过至少两个ADC时钟周期
###  例程
本历程为单次转换，非扫描，内部软件中断，使用规则组通道的方式获取通道值，
```c
#include "stm32f10x.h"                  // Device header
#include "ADC.h"
 
 void AD_Init(void)
 {
	 //时钟使能，需要使能对应ADC与端口，不需要使能端口复用
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_ADC1,ENABLE);
	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA,ENABLE);
	RCC_ADCCLKConfig(RCC_PCLK2_Div8);
	 // 引脚初始化，需要作为输入通道的引脚模式设置为模拟输入
	 GPIO_InitTypeDef GPIO_InitStructure;
	 GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AIN;
	 GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0 |GPIO_Pin_1 |GPIO_Pin_2 ;
	 GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	 GPIO_Init(GPIOA,&GPIO_InitStructure);

	// ADC外设初始化，为模式，对其方式，外部触发方式，是否转换与扫描，每次转换的通道数
	 ADC_InitTypeDef ADC_InitStructure;
	 ADC_InitStructure.ADC_Mode = ADC_Mode_Independent;
	 ADC_InitStructure.ADC_DataAlign = ADC_DataAlign_Right;
	 ADC_InitStructure.ADC_ExternalTrigConv = ADC_ExternalTrigInjecConv_None;
	 ADC_InitStructure.ADC_ContinuousConvMode = DISABLE;
	 ADC_InitStructure.ADC_ScanConvMode = DISABLE;	 
	 ADC_InitStructure.ADC_NbrOfChannel = 1;
	 ADC_Init(ADC1,&ADC_InitStructure);
	 ADC_Cmd(ADC1,ENABLE);
	 //ADC校准
	 ADC_ResetCalibration(ADC1);
		while(ADC_GetResetCalibrationStatus(ADC1) == SET);
		ADC_StartCalibration(ADC1);
		while(ADC_GetCalibrationStatus(ADC1));
 }


uint16_t AD_GetValue(uint8_t ADC_Channel)
{
	 ADC_RegularChannelConfig(ADC1,ADC_Channel,1,ADC_SampleTime_55Cycles5);
	//软件触发转换
ADC_SoftwareStartConvCmd(ADC1, ENABLE);
	
	//等待转换完成	
	while(!ADC_GetFlagStatus(ADC1,ADC_FLAG_EOC));
	//获取寄存器中转换出的值
return ADC_GetConversionValue(ADC1);
}


一般流程：
配置：
	使能ADC与GPIO时钟，
	配置GPIO口为模拟输入，
	ADC初始化，一般简单情况为单次转换非扫描
	且无外部触发
	使ADC上电 
	ADC校准，依次调用_adc.h文件中带cali的四个函数。
获取值：
	使用规则组通道配置函数将要触发转换的通道放入序列中，如果只需要一个通道可以放在配置中，
	软件触发，
	等待转换完成EOC被置位，
	 读取寄存器中的值，该值为0-4095
可以根据需求来选择使用规则通道还是注入通道，是否开启模拟看门狗，ADC中断等情况
在扫描模式中，只有对整个序列全部完成转换后才会对EOC进行置数，在使用规则通道时，由于规则组只有一个结果寄存器，要配合DMA来对获取到的数值进行存储。


	
```