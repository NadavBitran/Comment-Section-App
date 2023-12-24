import "./Pagination.scss";

function Pagination({currentPage , setClickAction , totalPages}){
    const limitPage = 5 
    const lowestPage = (currentPage - (limitPage / 2)) < 1 ? 1 : (currentPage - limitPage)
    const highestPage = Math.min((currentPage + (limitPage - (currentPage - lowestPage))) - 1 , totalPages)

    const pageNumbers = Array.from({ length: highestPage - lowestPage + 1 }, (_, index) => lowestPage + index)

    return (
        <div className={"Pagination"}>
            <ul>
                <li onClick={() => setClickAction(1)}>{"<<"}</li>
                <li onClick={() => setClickAction(currentPage - 1)}>{"<"}</li>
                {pageNumbers.map((page) => (
                    <li onClick={() => setClickAction(page)} key={page} className={page===currentPage ? "active" : ""}>
                        <a>{page}</a>
                    </li>
                ))}
                <li onClick={() => setClickAction(currentPage + 1)}>{">"}</li>
                <li onClick={() => setClickAction(totalPages)}>{">>"}</li>
            </ul>
        </div>
    )
}

export default Pagination;
