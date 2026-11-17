#include <stdio.h>

int main(void)
{
    int m;
    scanf("%i", &m);
    //if (m <= 1 && m >= 100)
    //{
    //    return 1;
    //}

    if (m != 1 && m % 2 == 1)
    {
        m = m - 1;
    }

    for (int i = 1; i <= m; i++)
    {
        if (i % 2 == 1)
        {
            printf("%i ", i);
        }
    }
    printf("\n");
    return 0;
}