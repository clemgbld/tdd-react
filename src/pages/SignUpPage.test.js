import SignUpPage from "./SignUpPage";
import {render,screen,  waitForElementToBeRemoved} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {rest} from "msw";



const verifyPasswords = (first,second) => {
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm password");
    const btn = screen.getByRole("button");
    userEvent.type(password,first);
    userEvent.type(confirmPassword,second);

    return {
        btn
    }
}


describe('SignUpPageWithTranslation', () => {

    describe('Layout', () => {
        it("has a header", () => {
            render(<SignUpPage/>)
            const header = screen.queryByRole("heading", {name: "Sign Up"});
            expect(header).toBeInTheDocument();
        })
    })
  it("has user name input", () => {
      render(<SignUpPage/>)

      const input = screen.getByLabelText("Username");

      expect(input).toBeInTheDocument();
  })

  it("has email input", () => {
    render(<SignUpPage/>)

    const input = screen.getByLabelText("Email");

    expect(input).toBeInTheDocument();
})

it("has password input", () => {
    render(<SignUpPage/>)

    const input = screen.getByLabelText("Password");

    expect(input).toBeInTheDocument();
})

it("has password type for password", () => {
    render(<SignUpPage/>)

    const input = screen.getByLabelText("Password");


    expect(input.type).toBe("password");
})

it("has confirm password input", () => {
    render(<SignUpPage/>)

    const input = screen.getByLabelText("Confirm password");

    expect(input).toBeInTheDocument();
})

it("has confirm password type for password", () => {
    render(<SignUpPage/>)

    const input = screen.getByLabelText("Confirm password");


    expect(input.type).toBe("password");
})

it("has signup btn", () => {
    render(<SignUpPage/>)

    const btn = screen.getByRole("button");

    expect(btn).toBeInTheDocument();
})

it("should have a disabled button initialy", () => {
    render(<SignUpPage/>)

    const btn = screen.getByRole("button");

    expect(btn).toBeDisabled();

})

describe("Interaction", () => {

    let requestBody;
    const server = setupServer(rest.post("/api/1.0/users", (req,res,ctx) => {
        requestBody = req.body;  
        return res(ctx.status(200))
          
    }))

    beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
    
    const setup = () => {
        render(<SignUpPage/>)
        const password = screen.getByLabelText("Password");
        const confirmPassword = screen.getByLabelText("Confirm password");
        const email = screen.getByLabelText(/email/i);
        const username = screen.getByLabelText(/username/i);
        const btn = screen.getByRole("button");
        userEvent.type(username,"clemgbld");
        userEvent.type(email,"exemple@hotmail.fr");
        userEvent.type(password,"azerty");
        userEvent.type(confirmPassword,"azerty");

        return {
            btn,
            password,
            confirmPassword,
            username,
            email
        }
        
    }
    it("enables the button when password and password repeat have same value", ()=> {
        render(<SignUpPage/>)
        const {btn}= verifyPasswords("azerty", "azerty")

        expect(btn).not.toBeDisabled(); 
    })

    it("sends userName , email and passwords to backend after cliking the button", async () => {
      

        const {btn} =setup()

       

        userEvent.click(btn);

        await screen.findByText(/please check your email to activate your account/i)

       
        expect(requestBody).toEqual({username: 'clemgbld',
    email:"exemple@hotmail.fr",
password: 'azerty',
})


       
    })

    it("disables submit btn after api call", async () => {
        


const {btn} =setup()
       

        userEvent.click(btn);

        await screen.findByText(/please check your email to activate your account/i)


       
     expect(btn).toBeDisabled();


       
    })

    it("should have a loading spinner while the post request is pending", async () => {
        
        
        
        const {btn} =setup()
               
        
                userEvent.click(btn);
        
               const spinner = await screen.findByRole("status", {hidden: true})
        
        
        expect(spinner).toBeInTheDocument()
        await screen.findByText(/please check your email to activate your account/i)
               
            })

            it("does not display spinner when thre is no api request", async () => {
                setup();
                const spinner = screen.queryByRole("status", {hidden: true});
        
                expect(spinner).not.toBeInTheDocument()
                
            })

            it("should display account activation notification", async () => {
        
                const {btn} =setup()
                       
                
                        userEvent.click(btn);
                
                       const sucessText = await screen.findByText(/please check your email to activate your account/i)
                
                       expect(sucessText).toBeInTheDocument();
                    
                       
                    })

                    it("should not have sucess message initially", () => {
                        render(<SignUpPage/>);
                        const sucessMessage = screen.queryByText(/please check your email to activate your account/i);
                        expect(sucessMessage).not.toBeInTheDocument();
                    })

                    it('hides sign up from the button',async () => {
                       
                        
                        const {btn} = setup()
                               
                        
                                userEvent.click(btn);
                        
                              

                               const form = screen.getByTestId('form-signUp')

                            //   await waitFor(() => {
                            //     expect(form).not.toBeInTheDocument();
                            //   })

                            await waitForElementToBeRemoved(form);
                        
                               
                    })

                    const generateValidationError = (field, message) => {
                        return rest.post("api/1.0/users", (req,res,ctx) => {
                            return res(ctx.status(400), ctx.json({validationErrors: {
                                [field]:message
                            }}));
                        })

                    }

                    it.each`
                    field         | message 
                    ${"username"} | ${'Username cannot be null'}
                    ${'email'}    | ${'E-mail cannot be null'}
                    ${'password'} | ${"Password cannot be null"}
                    `("displays $message for field",async ({field,message}) => {
                        
                        server.use(
                          generateValidationError(field,message)
                        );

                        const {btn} = setup();
       
                        userEvent.click(btn);
                        const validationError = await screen.findByText(message);
                        expect(validationError).toBeInTheDocument();
                    })

                    it("hides spinner and enables button after response received", async () => {
                        server.use(
                            generateValidationError('username', "Username cannot be null")
                        );
                
                       const {btn} = setup();
                       
                       userEvent.click(btn);
            
                       await screen.findByText("Username cannot be null");
            
                       expect(screen.queryByRole("status")).not.toBeInTheDocument()
                       expect(btn).toBeInTheDocument();
                
                        })

          it("displays mismatch message for password repeat input", () => {
              const{password,confirmPassword} =setup();
              userEvent.type(password,'azerty');
              userEvent.type(confirmPassword,'azerti');

              const validationError = screen.queryByText("Password mismatch");

              expect(validationError).toBeInTheDocument()

          })

          it.each([
              ['username','Username cannot be null', 'Username'],
              ['email','Email cannot be null', 'Email'],
              ['password','Password cannot be null', 'Password'],
          ])("clears conditional errors after password is updated", async (field,message,label) => {
            server.use(
                generateValidationError(field, message)
            );

            const {btn} = setup();
            userEvent.click(btn);

            const validationError = await screen.findByText(message);
  
             userEvent.type(screen.getByLabelText(label), "updated");
  
             expect(validationError).toHaveTextContent('');


          })

          

})


})