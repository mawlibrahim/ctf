#include <stdio.h>

int main(void)
{
//     int n = 50;
//     int *p = &n;
//     printf("%i\n", *p);
//     printf("%p\n", &p);

    // string s = "Baim";
    // printf("%p\n", s);
    // printf("%p\n", &s[1]);

    char *s ="Bacot\n";
    // for (int i = 0; i < 6; i++)
    // {
    //     printf("%c\n", s[i]);
    // }

    printf("%c", *s);
    printf("%c", *(s+1));
    printf("%c", *(s+2));
    printf("%c", *(s+3));
    printf("%c", *(s+4)); 
}