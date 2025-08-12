import { FormItem, Input, Notification, Select, toast } from '@/components/ui'


const filterCustomers = [
    {
    value:"Cliente 1", label:" Cliente 1"
    },
    {
    value:"Cliente 2", label:" Cliente 2"
    },   
    {
     value:"Cliente 3", label:" Cliente 3"
    },
]

export const ContentAssignService = () => {

      return (
         
            <div className="px-1">
                <form action="#">
                    <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-5 mt-4">
                        <FormItem
                        asterisk
                        label="Nombre Empresa"
                        // invalid={errors.userId && touched.userId}
                        // errorMessage={errors.userId}
                        >
                            <Input
                                disabled
                                autoComplete="on"
                                name="userId"
                                placeholder="Gasfieteria SB"
                                type="text"
                                // value={values.username}
                                // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                // setValues({
                                //     ...values,
                                //     userId: e,
                                // })
                                // }
                            />
                        </FormItem>

                        <FormItem
                        asterisk
                        label="Cliente"
                        // invalid={errors.customerId && touched.customerId}
                        // errorMessage={errors.customerId}
                        >
                        <Select                        
                            options={filterCustomers}
                            placeholder="Seleccionar"
                                // value={filterCustomers?.filter(
                                //     (option: TSelect) => option.value === values.customerId
                                // )}
                                // onChange={(option: TSelect) => {
                                //     form.setFieldValue(field.name, option?.value)
                                // }}
                            />
                        </FormItem>
                        <FormItem
                        asterisk
                        label="Correo Empresa"
                        >
                            <Input
                                disabled
                                autoComplete="on"
                                name=""
                                placeholder="Gasfieteriasb@gmai.com"
                                type="email"
                            />
                        </FormItem>
                        
                        <FormItem
                        asterisk
                        label="Correo cliente"
    
                        >
                               <Input
                                disabled
                                autoComplete="on"
                                name=""
                                placeholder="cliente@gmail.com"
                                type="email"
                            />
                        </FormItem>
                        <FormItem
                        asterisk
                        label="Contácto empresa"
                        >
                               <Input
                                disabled
                                autoComplete="on"
                                name=""
                                placeholder="+56 9 612 621 12"
                                type="number"
                            />
                        </FormItem>
                        <FormItem
                        asterisk
                        label="Contácto cliente"
                        >
                               <Input
                                disabled
                                autoComplete="on"
                                name=""
                                placeholder="+56 9 612 621 12"
                                type="number"
                            />
                        </FormItem>
                    </div>
                    <div className='grid grid-cols-1 gap-0 mt-4'>
                        <FormItem
                        asterisk
                        label="Asunto"
                        // invalid={errors.userId && touched.userId}
                        // errorMessage={errors.userId}
                        >
                            <Input

                                autoComplete="on"
                                placeholder="Ingresa un asunto"
                                type="text"
                            />
                        </FormItem>

                        <FormItem
                        asterisk
                        label="Mensaje"
                        // invalid={errors.userId && touched.userId}
                        // errorMessage={errors.userId}
                        >
                            <Input
                                textArea
                                autoComplete="on"
                                placeholder="Ingresa un Mensaje"
                                type="text"
                            />
                        </FormItem>
                    </div>
                </form>
            </div>
          

        
      )
    
    }
    