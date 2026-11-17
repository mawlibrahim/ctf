#include <stdio.h>
#include <string.h>

int main(void) {
    int a;
    char operator;
    int b;
    char *expression;
    scanf("%s", &expression);
    char *token = strtok(*expression, " ");
    printf("%d", *token);
}