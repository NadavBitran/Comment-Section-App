import { render , screen , waitFor} from "@testing-library/react";
import { beforeEach, describe, expect , vi } from "vitest";
import userEvent, { UserEvent } from "@testing-library/user-event";

import Filter from "../filter";

const sortChangeMock = vi.fn()
const searchChangeMock = vi.fn()
const orderChangeMock = vi.fn()

const searchInitial = ""
const optionInitial = {sortOption : 'createdAt' , orderOption : 'desc'}

const filter_JSX = 
<Filter 
    search={searchInitial}
    option={optionInitial}
    setSortChange={sortChangeMock}
    setOrderChange={orderChangeMock}
    setSearchChange={searchChangeMock}/>

describe("Filter Tests" , () => {

    afterEach(() => {
        sortChangeMock.mockClear()
        orderChangeMock.mockClear()
        searchChangeMock.mockClear()
    })

    describe("Filter Render" , () => {
        it("Should render Filter component correctly" , () => {
            render(filter_JSX)

        })
    })

    describe("Filter Functionality" , () => {
        it("Should trigger sort method after user choose" , async() => {
            
            const user = userEvent.setup()

            render(filter_JSX)

            const sortElement = screen.getByRole("combobox")

            await user.selectOptions(sortElement , "score")

            expect(sortChangeMock).toBeCalledTimes(1)
        })

        it("Should trigger search 1 second after user type in search textbox" , async () => {

            const user = userEvent.setup()

            render(filter_JSX)

            const searchElement = screen.getByRole("textbox")

            await user.type(searchElement , "some-search-text")

            await waitFor(() => expect(searchChangeMock).toBeCalledTimes(1))
        })

        it("Should trigger order change after user clicks" , async() => {

            const user = userEvent.setup()

            render(filter_JSX)

            const orderElement = screen.getByRole("button")

            await user.click(orderElement)

            expect(orderChangeMock).toBeCalledTimes(1)
        })
    })
})