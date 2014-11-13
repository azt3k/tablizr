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
    classSwitchOnly: false,
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
        'scrollable': {
            'margin-left': '35%',
            'overflow': 'scroll',
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
}
````

- `breakpoint`: the point at which the responsive tables kick in (the pixel width of the screen)
- `sort`: enables / disables the row sorter
- `respond`: enables / disable the responsive tables
- `classSwitchOnly`: enables \ disables the use of inline styles in case you want greater control over the css used
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