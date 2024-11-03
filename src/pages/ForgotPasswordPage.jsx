import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {

    const [number, setNumber] = useState(60);  // زمان شمارش
    const [isDisabled, setIsDisabled] = useState(false);  // وضعیت دکمه
    const [text, setText] = useState('send');  // نمایش زمان یا متن
  
    const countdown = (number) => {
      setIsDisabled(true);  // دکمه غیرفعال شود
      for (let i = number; i >= 0; i--) {
        setTimeout(() => {
          if (i === 0) {
            setText('resend');  // وقتی شمارش به صفر رسید
            setIsDisabled(false);  // دکمه دوباره فعال شود
          } else {
            setText(i);  // نمایش زمان باقی‌مانده
          }
        }, (number - i) * 1000);  // زمان‌بندی برای هر ثانیه
      }
    }; 

  return (
    <div className="flex justify-center items-center flex-col h-screen  bg-gradient-to-r from-red-500 from-30% to-black to-50%">
        <Card className="w-1/2 h-3/5 flex justify-center items-center border-white border-1">
           <CardHeader className="flex justify-center items-center mt-8 mb-8">
            <h1 className="text-5xl flex justify-center items-center text-white font-bold">password recovery</h1>
           </CardHeader>
           <CardBody>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col justify-center items-center">
              <div className="flex w-3/5 flex-wrap md:flex-nowrap gap-6 flex-col">
                <Input type="email" label="Email" />
                <div className="flex">
                    <Input type="text" label="code" />
                    <Button className="h-14 ml-1" onClick={() => {countdown(number)}} disabled={isDisabled} >{text}</Button>
                </div>
                <Button type="submit" color="danger" variant="bordered" className="text-medium h-14">submit</Button> 
              </div>  
            </form>
           </CardBody>
            <Link to='/' className="text-medium mb-20">back to Home</Link>
        </Card>
    </div>
  );
}

export default ForgotPasswordPage;