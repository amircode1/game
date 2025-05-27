import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="flex justify-center items-center flex-col h-screen bg-gradient-to-r from-red-500 from-30% to-black to-50%">
      {/* کارت برای فرم ورود */}
      <Card className="w-full max-w-lg lg:max-w-2xl flex justify-center items-center border-white border-1 p-6 lg:p-10">
        <CardHeader className="flex justify-center items-center mb-6">
          <h1 className="text-4xl lg:text-5xl text-white font-bold">Login</h1>
        </CardHeader>
        
        <CardBody>
          <form onSubmit={e => e.preventDefault()} className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col gap-6 w-full">
              {/* ایمیل */}
              <Input
                type="email"
                label="Email"
                fullWidth
                className="text-white"

              />
              {/* رمز عبور */}
              <Input
                type="password"
                label="Password"
                fullWidth
                className="text-white"

              />
              <Link to="/forget" className="text-center text-sm text-white hover:underline">
                Forgot Password?
              </Link>
              {/* دکمه ورود */}
              <Button onPress={() => {}}
                type="submit"
                color="danger"
                variant="bordered"
                className="text-lg h-14 w-full"
              >
                Login
              </Button>
            </div>
            
            {/* لینک ثبت نام */}
            <Link to="/signup" className="mt-5 text-white text-sm hover:underline">
              Don't have an account? Sign Up
            </Link>
          </form>
        </CardBody>
        
        {/* لینک بازگشت به صفحه اصلی */}
        <Link to="/" className="text-white mt-6 text-sm hover:underline">
          Back to Home
        </Link>
      </Card>
    </div>
  );
}

export default LoginPage;
