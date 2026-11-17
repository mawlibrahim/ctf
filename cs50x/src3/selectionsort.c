#include <stdio.h>

int main(void)
{
    int unsorted[] = {1, 5, 2, 4, 7, 6, 3};
    int smallest = unsorted[0];
    int sorted[7];
    for (int h = 0; h < 7; h++)
    {
        for (int i = 0; i < 7; i++)
        {
            if (unsorted[i] < smallest)
            {
                int smallest = unsorted[i];
                for (int j = 0; j < 7; i++)
                {
                    sorted[j] = smallest;
                }
            }
        }
    }
    for (int i = 0; i < 7; i++)
    {
        printf("%i\n", sorted[i]);
    }
}