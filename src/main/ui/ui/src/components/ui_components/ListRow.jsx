import React from 'react';

const ListRow = ({ onClick, children }) => {
    return (
        <div onClick={onClick} className={ 'list-row' }>
            { children }
        </div>
    );
}

export default ListRow;