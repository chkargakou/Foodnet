import React from "react";

function clearRedirect() {
    localStorage.clear();
}

function App() {
    return (
        <div className="App">
            <header className="App-header">

                <div className="w-12 h-12 my-16 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
                    <svg aria-hidden="true" className="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                </div>
                <h1 className="text-center mb-10 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">Η παραγγελία σας είναι στον δρόμο.</h1>
                <div className="w-full">
                    <center>
                    <img src="./assets/pizza.jpg" alt=""/>
                    </center>
                </div>
            </header>
            <div className="flex flex-col items-center my-10"><a href="/"><button className="btn" onClick={clearRedirect()}>Πίσω στην Αρχική</button></a></div>
        </div>

    );
};

export default App;