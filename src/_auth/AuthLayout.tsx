import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {
    const isAuthenticated = false;
  return (
    <>
        {isAuthenticated ?(
            <Navigate to='/'/>
        ): (
            <>
                <section className="flex flex-1 justify-center items-center flex-col py-10">
                    <Outlet/>
                </section>
                <img
                    src="\assets\images\cat-551554_1280.jpg"
                    alt='logo'
                    className="bg-opacity-0 xs:bg-opacity-100 hidden sm:block md:block h-screen w-1/2 object-cover bg-no-repeat"
                />

            </>
        )}
    </>
  )
}

export default AuthLayout