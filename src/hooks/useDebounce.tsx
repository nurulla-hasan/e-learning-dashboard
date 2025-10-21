import { useEffect, useState } from "react";

type TProps = {
    searchQuery: string;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const useDebounce = ({ searchQuery, setCurrentPage }: TProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1);
            setSearchTerm(searchQuery);
        }, 600);
        return () => clearTimeout(timeoutId); // cleanup for debounce
    }, [searchQuery, setCurrentPage]);

    return {
        searchTerm
    }
}

export default useDebounce