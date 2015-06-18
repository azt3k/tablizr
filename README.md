Tabelizr
========

Responsive sortable tables bro.

Options / Defaults
------------------

````json
{
    breakpoint: 767,
    sort: true,
    respond: true,
    respondStyle: 'split',
    classSwitchOnly: false,
    sortHandler: null,
    onBeforeSort: null,
    onAfterSort: null,
    css : {
        'pinned': {
            'position': 'absolute',
            'left': '0',
            'top': '0',
            'background': '#fff',
            'width': '35%',
            'overflow': 'hidden',
            'overflow-x': 'auto'
        },
        'table-wrapper-nosplit': {
            'overflow': 'scroll',
            '-webkit-overflow-scrolling': 'touch',
            'overflow-y': 'hidden'
        },
        'scrollable': {
            'margin-left': '35%',
            'overflow': 'scroll',
            '-webkit-overflow-scrolling': 'touch',
            'overflow-y': 'hidden'
        },
        'table-wrapper': {
            'white-space': 'nowrap',
            'position': 'relative',
            'margin-bottom': '20px',
            'overflow': 'hidden'
        },
        'sort-trigger': {
            'cursor': 'pointer'
        }
    }
};
````

- `breakpoint`: the point at which the responsive tables kick in (the pixel width of the screen)
- `sort`: enables / disables the row sorter
- `respond`: enables / disable the responsive tables
- `respondStyle`: `split` or `nosplit` - split pins first col in place and make others scrollable, nosplit makes entire table scrollable
- `classSwitchOnly`: enables \ disables the use of inline styles in case you want greater control over the css used
- `sortHandler`: a function that defines how the sort occurs - tabelizr passes the supplied function a conf object with the following properties:
    - `el`: a jquery object representing the attached table
    - `rows`: a jquery object representing the rows
    - `col`: the index of the column being sorted
    - `isSorted`: a boolean that indicates if the column already has a sort direction applied
    - `sortDirection`: a string that indicates the sort direction - `asc` or `desc`
    - `tablizr`: the tablizr plugin object
    - Once finished manipulating the rows you need to call `conf.tablizr.applySort(rows, col, sortDirection);` to apply the sort - see `demo-ajax-sort.html` for an example
- `onBeforeSort`: a callback function to run prior to the sort
- `onAfterSort`: a callback fucntion to run after the sort
- `css`: controls what inline styles are being applied when the table goes into responsive mode.

## Sorting

If you want to use a different value to sort by rather than the cell contents simply add a `data-sort` attribute to the td:

````html
<table class="table">
    <thead>
        <tr>
            <th>Perk</th>
            <th>Description</th>
            <th>ID</th>
            <th>Skill Req</th>
            <th>Perk Req</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td data-sort="Fish Sticks">Steel Smithing</td>
            <td>Can create Steel armor and weapons at forges, and improve them twice as much.</td>
            <td>000cb40d</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>Arcane Blacksmith</td>
            <td>You can improve magical weapons and armor.</td>
            <td>0005218e</td>
            <td>60 Smithing</td>
            <td>Steel Smithing</td>
        </tr>
    </tbody>
</table>
````

Limitations
-----------

- the sort functionality doesn't work on nested tables or tables that use colspan or rowspan.
- the sort functionality assumes that the first row is the heading row


Todo
----

- provide a more automated way of attaching ajax sorts
- allow for more data attribute overrides
- improve pagr support
