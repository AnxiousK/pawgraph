import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/shared/loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


const SignupForm = () => {
    const { toast } = useToast()
    const {checkAuthUser, isLoading : isUserLoading} = useUserContext();
    const navigate = useNavigate();

    const { mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccount();

    const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();


     // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name:'',
      username: "",
      email:'',
      password:''
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);

    if (!newUser) {
        console.error("Failed to create user account");
        return toast({ title: "Sign up failed. Please try again" });
    }

    console.log("User account created:", newUser);

    const session = await signInAccount({
        email: values.email,
        password: values.password,
    });

    if (!session) {
        console.error("Failed to sign in user");
        return toast({ title: "Sign in failed. Please try again." });
    }

    console.log("User signed in with session:", session);

    const isLoggedIn = await checkAuthUser();

    console.log("Is user logged in?", isLoggedIn);

    if (isLoggedIn) {
        form.reset();
        navigate("/");
    } else {
        console.error("User authentication failed");
        return toast({ title: "Sign up failed. Please try again." });
    }
  }
    return (
    <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.png" alt="logo" width="250" height="36"/>
            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create A New Account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">To use Pawgraph, please enter your details</p>
        
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>e-mail</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">{isCreatingUser ? (
            <div className="flex-center gap-2"><Loader />Loading...</div>
        ):"Sign up" }</Button>
        <p className="text-small-regular text-light-2 text-center mt-2">Already have an account?<Link to='/sign-in' className="text-primary-500 text-small-semibold ml-1">Log in</Link></p>
      </form>
      </div>
    </Form>
    
  )
}

export default SignupForm