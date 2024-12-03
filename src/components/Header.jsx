import React,{useState} from "react";
import './Header.css';
function Header({onSearch,onFilter,onHome}){
    const[query,setQuery]=useState('');
    function handleSearchInputChange(e) {
        const value=e.target.value;
        setQuery(value);
    }
    function handleSearchSubmit(e){
        e.preventDefault();
        onSearch(query);
        setQuery('');
    }
    return(
        <div className="header">
            <h1>Task Manager</h1>
            <div className="header-buttons">
                <button onClick={()=>onFilter("completed")}>Show Completed Tasks</button>
                <button onClick={()=>onFilter("pending")}>Show Pending Tasks</button>
                <button onClick={()=>onFilter("overdue")}>Overdue Tasks</button>
                <button onClick={onHome}>Home</button>
            </div>
            <div className="search-bar">
                <form className="search-title" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        value={query}
                        onChange={handleSearchInputChange}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
        </div>
    )
}
export default Header;