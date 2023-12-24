import React from "react";
import sortAsc from "/images/sortAsc.png";
import sortDesc from "/images/sortDesc.png";
import { useState , useEffect  } from "react";
import "./Filter.scss";

function Filter({ search, option, setSortChange, setSearchChange, setOrderChange }) {
    const [debouncedSearch , setDebouncedSearch] = useState("")

    useEffect(() => {
        if(search === "" && debouncedSearch === "") return

        const timer = setTimeout(() => {setSearchChange(debouncedSearch)} , 1000)

        return () => clearTimeout(timer)

    } , [debouncedSearch])



  return (
    <div className={"Filter"}>
      <input
        className={"Search"}
        type="text"
        defaultValue={search}
        onChange={(event) => setDebouncedSearch(event.target.value)}
      />
      <div className={"Sort"}>
        <select
          className={"Sort__type"}
          onChange={(event) => setSortChange(event.target.value)}
          defaultValue={option.sortOption}
        >
          <option value="createdAt">Date</option>
          <option value="score">Likes</option>
        </select>
        <button
          className={"Sort__button"}
          onClick={() => 
            setOrderChange(option.orderOption === "desc" ? "asc" : "desc")
          }
        >
          <img
            className={"Sort__icon"}
            src={option.orderOption === "desc" ? sortDesc : sortAsc}
            alt="Sort Icon"
          />
        </button>
      </div>
    </div>
  );
}

export default Filter;
