import {describe , expect , it , vi} from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '../../../../test-utils';
import InfoCard from "../InfoCard";


describe("InfoCard Render" , () => {

    it("renders the InfoCard component correctly" , () => {
        render(<InfoCard
            title={"title"}
            titleImage={"/images/technicalSupport.png"}
            desc={["text1","text2","text3","text4"]}
            additionalClassName={"name1"} />)
    })
    
})

describe("InfoCard Functionality" , () => {

    it("activates the InfoCard's component onTitleClick action while user clicks on title" , async() => {
        const user = userEvent.setup()
        const mocked_fn = vi.fn()
        render(<InfoCard
            title={"title"}
            titleImage={"/images/technicalSupport.png"}
            onTitleClick={mocked_fn}
            desc={["text1","text2","text3","text4"]}
            additionalClassName={"name1"} />)

        const titleElement = screen.getByRole("heading" , {level : 2})

        await user.click(titleElement)

        expect(mocked_fn).toBeCalledTimes(1)
        
    })
})