# 通用定时器

## 比较输出 OC
输出比较模式
![](通用定时器PWM配置_image_1.png)
![](通用定时器PWM配置_image_2.png)
一般用向上计数，有效电平为高，PWM1模式即可，也可以配置其他的，作为脉冲信号都一样，只是计算占空比的方式略有不同，即比较输出通道是高电平的时间不同。   
![](通用定时器PWM配置_image_3.png)
```c
简易配置pwm，以TIM2_CH4为例：
void Motor1_Control_Init(u32 arr,u32 psc)
{  
	GPIO_InitTypeDef GPIO_InitStructure;
	TIM_TimeBaseInitTypeDef  TIM_TimeBaseStructure;
	TIM_OCInitTypeDef  TIM_OCInitStructure;
	NVIC_InitTypeDef NVIC_InitStructure;

	RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);	//使能定时器3时钟
 	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA | RCC_APB2Periph_AFIO, ENABLE);  //使能GPIO外设和AFIO复用功能模块时钟
//  GPIO_PinRemapConfig(GPIO_PartialRemap2_TIM2, ENABLE);  
   //设置该引脚为复用输出功能,输出TIM3 CH2的PWM脉冲波形	GPIOB.5
	GPIO_InitStructure.GPIO_Pin = GPIO_Pin_3 ;//TIM_CH2
	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;  //复用推挽输出
	GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	GPIO_Init(GPIOA, &GPIO_InitStructure);//初始化GPIO

   //初始化TIM3
	TIM_TimeBaseStructure.TIM_Period = arr; //设置在下一个更新事件装入活动的自动重装载寄存器周期的值
	TIM_TimeBaseStructure.TIM_Prescaler =psc; //设置用来作为TIMx时钟频率除数的预分频值 
	TIM_TimeBaseStructure.TIM_ClockDivision = 0; //设置时钟分割:TDTS = Tck_tim
	TIM_TimeBaseStructure.TIM_CounterMode = TIM_CounterMode_Up;  //TIM向上计数模式
	TIM_TimeBaseInit(TIM2, &TIM_TimeBaseStructure); //根据TIM_TimeBaseInitStruct中指定的参数初始化TIMx的时间基数单位
	
	TIM_ITConfig(TIM2,TIM_IT_Update,ENABLE ); //使能指定的TIM3中断,允许更新中断
	NVIC_InitStructure.NVIC_IRQChannel = TIM2_IRQn;  //TIM3中断
	NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 0;  //先占优先级0级
	NVIC_InitStructure.NVIC_IRQChannelSubPriority = 3;  //从优先级3级
	NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE; //IRQ通道被使能
	NVIC_Init(&NVIC_InitStructure);  //根据NVIC_InitStruct中指定的参数初始化外设NVIC寄存器

	//初始化TIM3 Channel2 PWM模式	 
	TIM_OCInitStructure.TIM_OCMode = TIM_OCMode_PWM1; //选择定时器模式:TIM脉冲宽度调制模式2
 	TIM_OCInitStructure.TIM_OutputState = TIM_OutputState_Enable; //比较输出使能
	TIM_OCInitStructure.TIM_OCPolarity = TIM_OCPolarity_High; //输出极性:TIM输出比较极性高
	TIM_OC4Init(TIM2, &TIM_OCInitStructure);  //根据T指定的参数初始化外设TIM3 OC2

	TIM_OC4PreloadConfig(TIM2, TIM_OCPreload_Enable);  //使能TIM2在CCR4上的预装载寄存器
	//TIM_ARRPreloadConfig(TIM2, ENABLE);
	TIM_SetCompare4(TIM2,1000);  
	TIM_Cmd(TIM2, ENABLE);  //使能TIM2
	
}
流程说明：
使能 定时器，输出端口，复用功能AFIO的时钟
配置将输出引脚为复用推挽输出模式
GPIO_InitTypeDef
根据要使用的作为输出通道的引脚组，选择引脚映射类型 
GPIO_PinRemapConfig
配置定时器的定时周期，预分频值，计数模式 TIM_TimeBaseInitTypeDef
根据需要使能定时器需要用到的中断，如事件更新中断
配置，使能中断
NVIC_InitTypeDef
配置比较输出模式，TIM_OCInitTypeDef
在对定时器比较输出初始化时， 要根据不同的通道使用不同的初始化函数：TIM_OCxInit
使能定时器的预装载寄存器
由于不同通道x的比较寄存器为CCRx，因此使用不同的函数 TIM_SetComparex 配置响应的寄存器
最后记得使能定时器
```