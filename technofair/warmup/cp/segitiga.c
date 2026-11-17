#include <stdio.h>

int main(void)
{
    int m;
    scanf("%i", &m);
    if (m < 1 || m > 50)
    {
        return 1;
    }

    for (int i = 1; i <= m; i++)
    {
        for (int j = 1; j <= i; j++)
        {
            printf("^");
        }
        printf("\n");
    }
    return 0;
}