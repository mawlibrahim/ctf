#include <stdio.h>

int main(void)
{
    int m;
    scanf("%i", &m);
    if (m < 1 || m > 100)
    {
        return 1;
    }
    for (int i = 0; i < m; i++)
    {
        printf("Technofair!\n");
    }
    return 0;
}