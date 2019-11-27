// =========================
// Initialize Connect4 Class
// =========================

class Connect4 {
    // Create constructor and pass the element to which we will attach the gameboard grid
    constructor(element) {
        this.rows = 6;
        this.cols = 7;
        this.element = element;
        this.player = 'Red'
        // Methods below invoked when create new instance of Connect4 class
        this.createGrid();
        this.eventListeners();
    }

// Creates Grid with number of Rows/Columns specified in constuctor and appended to element passed through

    createGrid () {
        // Grabs div element that we pass through and stores as variable
        const $grid = $(this.element); 
        // Nested for loop to create # of rows specified in constructor, each row with # of columns specified in constructor.  Classes added for identification and manipulation later.
        for (let i = 0; i <this.rows; i++) {
            const $row = $('<div>').addClass(`row`);
            for (let x = 0; x <this.cols; x++) {
                const $col = $('<div>').addClass(`col blank`).attr('data-col',x).attr('data-row',i); // Used attr to assign unique col-row combinations to each $col div
                $row.append($col); // appends column to the row div
        }
        $grid.append($row); // Appends each row to the grid
        }
    }

// -------------------------------------
// EVENT LISTENERS FOR UI and GAMEPLAY
// -------------------------------------

    eventListeners () {
        const $grid = $(this.element);
        const that = this; // stores reference to the original object so that we can also have access to the this event in the event listener functions below

        // Iterates backwards and finds first empty slot in a given column.
        const findEmptySlot = (col) => {
            const slots = $(`.col[data-col='${col}']`);
            // Grabs all elements with same data-col identifier
            for (let i = slots.length-1; i>=0; i--) {
                const $slot = $(slots[i]);
                if($slot.hasClass('blank')) {
                    return $slot;
                }
            }
            return null;
        }

        // Methods to show user where the disc would be dropped.
        $grid.on('mouseenter','.col.blank', function() {
            const col = $(this).data('col'); // Ids column
            const $emptySlot = findEmptySlot(col); // Ids last empty slot within column
            $emptySlot.addClass(`${that.player}Option`);
        })

        $grid.on('mouseleave', '.col', function () {
            $('.col').removeClass(`${that.player}Option`);
        })

        $grid.on('click','.col.blank', function () {
            const row = parseInt($(this).data('row'),10); // IDs Row and stores index value as integer variable
            const col = parseInt($(this).data('col'),10);// IDs Column and stores index value as integer variable
            console.log(row,col);
            const $emptySlot = findEmptySlot(col);
            $emptySlot.removeClass('blank').removeClass(`${that.player}Option`);
            $emptySlot.addClass(that.player);
            

            const winner = that.checkWinner($emptySlot.data('row'),$emptySlot.data('col'))
            if (winner) {
                $('#win').text(`${that.player} wins!`).css('font-size','60px').css('color',`${that.player}`);
                $('.modal-container').addClass('modal-active')
                return;
            }
            that.player = (that.player === 'Red') ? 'Yellow' : 'Red'; // Alternates between players once a move is made via click
            $('#turn').text(`Turn: ${that.player} Player`).css('color','black');
        })

        // Function to restart game/resets player to red
        $('button').on('click', function () {
            $('.col').removeClass('Red').removeClass('Yellow').addClass('blank');
            $('#turn').css('color','#68E8B7');
            $('.modal-container').removeClass('modal-active')
            that.player = 'Red';
        })
    }

// Function to check if winner in horizontal, vertical, or diagonal directions

    checkWinner(row,col) {
        const that = this;

        function $getSlot(i,x) {
            return $(`.col[data-row='${i}'][data-col='${x}']`)
        }

        // Increments in the passed-through direction to check if the subsequent pieces match the color of the origin piece
        function sumInstances(direction) {
            let total = 0;
            let i = row + direction.i;
            let x = col + direction.x;
            let $slot = $getSlot(i,x);
            while (i>=0 && i<that.rows && x>=0 && x < that.cols && $slot.hasClass(`${that.player}`)) {
                total++;
                i += direction.i;
                x += direction.x;
                $slot = $getSlot(i,x);
            }
            return total;
        }

        // Sums slots that match current players color
        function sumTotal(a,b) {
            const total = 1 + sumInstances(a) + sumInstances(b);
            if(total>=4) {
                return that.player;
            } else {
                return null;
            }
        }
    
// Checks columns for 4 of the same type by running the checkWin function on the rows above and below.
        function checkColumn() {
            return sumTotal({i:-1, x:0}, {i:1, x:0});
        }

        function checkRow() {
            return sumTotal({i:0, x:-1}, {i:0, x:1});
        }

        function checkDiagonalUp() {
            return sumTotal({i:1, x:-1}, {i:1, x:1});
        }

        function checkDiagonalDwn() {
            return sumTotal({i:-1, x:-1}, {i:1, x:1});
        }

        return checkColumn() || checkRow() || checkDiagonalUp() || checkDiagonalDwn();
        
    }
}


$(() => {
    // Create new Connect4 grid object to the div with ID=grid
        const grid = new Connect4('#grid');
});