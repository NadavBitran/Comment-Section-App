import {describe , expect , it , vi} from 'vitest';
import {userEvent} from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils';
import Modal from "../Modal";


import { TYPE_MODAL } from '../Constants/constants';


describe("Modal Render" , () => {

    it("renders the warning Modal component correctly" , () => {
        render(<Modal   
                    title={"warningTitle"}
                    description={["WarningLine1" , "WarningLine2" , "WarningLine3"]}
                    modalType={TYPE_MODAL.WARNING}
                    loading={false} />)

        const titleElement = screen.getByText(/warningTitle/i)
        const descriptionElement = screen.getByText(/WarningLine3/i)
        const buttonElements = screen.getAllByRole("button")
        const spinnerElement = screen.queryByRole("img")

        expect(titleElement).toBeInTheDocument()
        expect(descriptionElement).toBeInTheDocument()
        expect(buttonElements).toHaveLength(2)
        expect(buttonElements[0]).toBeInTheDocument() &&  expect(buttonElements[1]).toBeInTheDocument()
        expect(spinnerElement).not.toBeInTheDocument()
    })

    it("renders the ack Modal component correcetly" , () => {
        render(<Modal   
            title={"ackTitle"}
            description={["AckLine1" , "AckLine2" , "AckLine3"]}
            modalType={TYPE_MODAL.ACKNOWLEDGE}
            loading={false} />)

        const titleElement = screen.getByText(/ackTitle/i)
        const descriptionElement = screen.getByText(/AckLine2/i)
        const buttonElements = screen.getAllByRole("button")
        const spinnerElement = screen.queryByRole("img")

        expect(titleElement).toBeInTheDocument()
        expect(descriptionElement).toBeInTheDocument()
        expect(buttonElements).toHaveLength(1)
        expect(buttonElements[0]).toBeInTheDocument()
        expect(spinnerElement).not.toBeInTheDocument()
    })

    it("renders the warning Modal's component loading spinner" , () => {
        render(<Modal   
            title={"warningTitle"}
            description={["WarningLine1" , "WarningLine2" , "WarningLine3"]}
            modalType={TYPE_MODAL.WARNING}
            loading={true} />)

        const spinnerElement = screen.getByRole("img")

        expect(spinnerElement).toBeInTheDocument()
    })
})

describe("Modal Functionality" , () => {

    it("activates the warning Modal's component click action function while user clicks on buttons" , async() => {
        const user = userEvent.setup()
        const mocked_fn = vi.fn()
        render(<Modal   
            title={"warningTitle"}
            description={["WarningLine1" , "WarningLine2" , "WarningLine3"]}
            modalType={TYPE_MODAL.WARNING}
            loading={true}
            setClickAction={mocked_fn} />)

        const buttonElements = screen.getAllByRole("button")

        await user.click(buttonElements[0])
        await user.click(buttonElements[1])

        expect(mocked_fn).toBeCalledTimes(2)
        
        
    })

    it("activates the ack Modal's component click action functino while user clicks on buttons" , async() => {
        const user = userEvent.setup()
        const mocked_fn = vi.fn()
        render(<Modal   
            title={"ackTitle"}
            description={["AckLine1" , "AckLine2" , "AckLine3"]}
            modalType={TYPE_MODAL.ACKNOWLEDGE}
            loading={false}
            setClickAction={mocked_fn} />)

        const buttonElements = screen.getAllByRole("button")

        await user.click(buttonElements[0])

        expect(mocked_fn).toBeCalledTimes(1)

    })
})