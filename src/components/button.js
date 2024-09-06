import React, {useState} from 'react';


function Button(){
    const [count, setCount] = useState(0);
    return(
        <div className="counter">
        <p>This button has been clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}> 
        click 
        </button>
        </div>

    );
}

export default Button;         