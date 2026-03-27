import Image from "next/image";
export default async function LoginForm() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-px">
        <div className="col-span-12 relative h-full grid-col-border">
          <div className="grid grid-cols-12 gap-px items-start">
            <div className="col-span-12 lg:col-span-6 grid-col-border">
              <ul className="flex flex-col gap-px">
                <li className="px-2 py-3 lg:px-5">
                  {/* Heading */}
                  <h1 className="text-sans-35 lg:text-sans-60 font-600">
                    Logga in
                  </h1>
                  <div className='mt-4 text-lg leading-relaxed prose'>
                    <p>
                      Inlogg för artister och personal.
                    </p>
                  </div>
                </li>
                <li>
                <div className="grid gap-px grid-cols-1 flex-grow">
                  <div className="grid-col-border">
                    <div className="px-2 py-3 lg:px-5">
                      <form method="post" action="">
                      <input type="hidden" name="form_type"/>
                      <input type="hidden" name="utf8"/>
                        <div className="flex flex-col gap-2 lg:gap-4 max-w-[440px]">
                          <label className="mb-1">
                            <input type="email" className="block w-full input-primary"/>
                            <p className="mt-1 uppercase text-sans-12 lg:text-sans-14 tracking-wider font-800">E-post</p>
                          </label>
                    
                          <label className="mb-1">
                            <input type="password" className="block w-full input-primary"/>
                            <div className="flex justify-between mt-1">
                              <p className="uppercase text-sans-12 lg:text-sans-14 tracking-wider font-800">Lösenord</p>
                            </div>

                          </label>
                    
                          <button type="submit" value="Sign Up" className="block w-full button button-primary h-atc text-left">
                            <div className="px-2 tracking-tighter text-sans-22 md:text-sans-30 md:px-3">
                              Logga in
                            </div>
                          </button>
                        </div>
                      </form>
                      </div>
                  </div>
                </div>
                </li>
              </ul>
            </div>
            <div className="hidden lg:block col-span-6 grid-col-border sticky top-7 min-h-hero-minus-header overflow-hidden">
              <div className="image overflow-hidden absolute inset-0">
                <Image
                  src="https://cdn.sanity.io/images/44gy0hz3/production/74c30b8ddf90c838485d1451717d07967cabe8f8-5168x2912.jpg"
                  alt="Login"
                  className="w-full h-full object-cover noise grayscale"
                  width={1000}
                  height={1000}
                  loading='lazy'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
