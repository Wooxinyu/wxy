```
简易模板
ALL:mytbf

mytbf:main.o mytbf.o
	$(CC) $^ -o $@

clean:
	rm *.o mytbf -rf
	
```