---
title: "Wacky Windows Environment Variables"
date: 05 Nov 2023
draft: false
toc: true
categories: ["Random", "Windows"]
description: "A small dive into the weird world of Windows environment variables and how its odd behaviours can be abused to bypass application logic"
cover: "cover.jpg"
---
## Introduction
Picture this - you've been blessed with the task of dissecting a binary written in C++ that looks like the following:
```C++
#include <iostream>
using namespace std;

void admin() {
    cout << "There is no DEMO - signs of an admin!";
}

void user() {
    cout << "I see a DEMO variable - signs of a regular user";
}

int main() {
    char* check;
    check = getenv("DEMO");
    if (check != NULL) {
        user();
    }
    else 
        admin();
}
```
What is it even doing, and is it possible to get to admin without being an admin? This post will look into some interesting Windows environment variable behaviours, and how they can be used to bypass application logic.

### Windows environment variables
But first, what the heck are Windows environment variables? Basically, Windows environment variables store data that is then used by the operating system and applications. There are two types: 
- User environment variables - environment variables that are set for each Windows user. These can be changed by the user; &
- System environment variables - environment variables that are set for all users of the machine. These can only be changed by a user with administrator permissions on the machine.

### The code
Now to look at the glorious C++ program. Focusing on `check = getenv("DEMO")` first:
{{< img getenv.png "Reading C++ documentation to understand getenv" >}}
Accoding to {{< externalLink "this C++ reference site" "https://en.cppreference.com/w/cpp/utility/program/getenv" >}}, `getenv` searches the environment list provided by the OS and returns the value of the environment variable. But interestingly, it will return a null pointer if the variable doesn't exist. So essentially if there's an environment variable called `DEMO` in the environment variables, then the `user()` function will run (as `check != NULL` evaluates to true). Otherwise, `admin()` is run (as `getenv()` returns a NULL pointer).

## Figuring out Windows environment variables
Armed with the above knowledge, getting to the admin function should be pretty straightforward. As long as the environment variable doesn't exist in either the user or system environment variables list, then `admin()` will be executed. So if `DEMO` was set as a **user environment variable**, the user can just delete the user environment variable. But what happens if `DEMO` is set as a **system environment variable** and the user is not an admin of the machine?

### Windows environment variable behaviour #1
After digging around for some formal documentation about environment variables from Microsoft, I cam across a {{< externalLink "very old piece of Windows documentation" "https://web.archive.org/web/20111225045158/http://support.microsoft.com/kb/100843/EN-US" >}} that had an extra bit of information not present in any current Microsoft documentation:
{{< img uservar.png "Old piece of Windows docs that is only viewable thanks to web archive" >}}
- User environment variables take precedence over system environment variables

What this means is that if a user and system environment variable both have the same name, the value of the user environment is used. 

So using this knowledge, it's possible for the user to overwrite the value of the system environment variable. But just this alone isn't enough to call `admin()` as a low privileged user on the machine. Whilst we can control the value of `DEMO`, we still need `getenv` to return a NULL pointer. So is it possible to create a user environment variable that both exists (so that the user environment variable is used in place of the system environment variable), and doesn't exist (so that `getenv` returns a NULL pointer) **at the same time**?

### Creating Schrödinger's environment variable
This is where the wacky behaviour really sets in. Microsoft really lacks documentation about the inner workings and behaviours of Windows. But after some digging around, I came across an {{< externalLink "awesome community managed reference guide" "https://ss64.com/nt/setx.html" >}} with an interesting piece of information about environment variables:
{{< img deleteenv.png "Reference stating there are multiple ways of deleting an env variable, but using setx and an empty string works too" >}}
- Setting a value of "" (empty quotes) will appear to delete the variable, it's not shown by SET but the variable name will remain in the registry.

This tells us that using the `setx` command can delete an environment variable, but the variable still exists in the registry. Could this be the birth of Schrödinger's environment variable?

## Bypassing logic to get admin
Time to put all the theory to the test.
{{< img env_start.png "Environment variable set up with DEMO as a system environment variable and there is no DEMO in the user environment variable" >}}
The above image is the initial set of environment variables of a machine. Note the user is a low privilege user, and can't make any edits to the system environment variable as the GUI options are grayed out.

{{< img env_test.png "Testing the C++ code with the above environment variables set. The user function is executed as expected" >}}
And as expected, the user function is executed. Now to try running `setx DEMO ""` in command prompt to "delete" the DEMO variable.

{{< img env_change.png "Creating the DEMO user environment variable with an empty string">}}
Interestingly, the GUI interface for managing environment variables shows that `DEMO` exists as a user environment variable with no value. But the real question is, what will the program think? 

{{< img env_bypass.png "Admin is executed as a low privilege user" >}}
And just like that, the low privilege user is able to reach the `admin()` function despite being a low privilege user that can't make any changes to the system environment variable!

## Conclusion
In summary, Windows environment variables are wack. By combining the fact that user environment variables take precedence over system environment variables and that setting an environment variable to an empty string effectively deletes a variable, it's possible to make a system environment variable essentially disappear to anything that relies on environment variables! All without ever being an admin on the machine.