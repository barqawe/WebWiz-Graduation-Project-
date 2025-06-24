"use client";
import { useState } from "react";
import style from "./TopNavButtons.module.scss";

export default function TopNavButtons() {
  const [selected, setSelected] = useState("ALL");

  const options = ["ALL", "HTML", "CSS", "JS", "REACT"];

  const handleSelection = (option) => {
    setSelected(option);
  };

  return (
    <nav className={style.topNavButtons}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelection(option)}
          className={selected === option ? style.selected : ""}
          data-type={option}
        >
          {option}
        </button>
      ))}
    </nav>
  );
}
