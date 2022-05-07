import {render,screen} from "@testing-library/react"
import Input from './Input'

describe('Input', () => {
it("has is-invalid class for input when error is set", () => {
   render(<Input error="Error Message"/>)
   const input = screen.getByRole("textbox");

   expect(input).toHaveClass("is-invalid");
})

it("has invalid-feedback class for span when help is set", () => {
    render(<Input error="Error Message"/>)
    const errorMessage = screen.getByText("Error Message");
    expect(errorMessage).toHaveClass("invalid-feedback");
})

it("shouldn't have invalid-feedback class for input initialy", () => {
    render(<Input />)
    const errorMessage = screen.getByTestId("error");

    expect(errorMessage).not.toHaveClass("invalid-feedback");


})

it("shouldn't have is-invalid class for input initialy", () => {
    render(<Input />)
    const input = screen.getByRole("textbox");

    expect(input).not.toHaveClass("is-invalid");


})
})