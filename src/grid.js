(function (window, Ractive) {
	'use strict';
        
    var _ = require('underscore');
    
    /* code for example purpose only */
    Ractive.components.Datepicker = require('ractive-datepicker');
    Ractive.decorators.Tooltip = require('ractive-tooltip');
    Ractive.components.Stepper = require('ractive-stepper');
    /* end of code for purpose */

    Ractive.components.RactiveGridComponent = Ractive.extend({
        template: require('grid.tpl.html'),
        isolated: true,
        data: () => {
            return {
                columns: [],
                rows: [],
                sortByColumn: false,
                filter: false,
                reverse: false,
                isFiltrable: function(column) {
                    var filter = this.get('filterCols');
                    return (filter && filter.indexOf(column) > -1) ? true : false;
                }
            }
        },
        oninit: function() {
            this.observe('sortByColumn', function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.set('filter.text', '');
                }
            });
        },
        oncomplete: function() {
            
            this.observe('rows', function(v) {
                this.set('filteredRows', this.get('rows'));
            });
            
            this.observe('filter.text', function ( filterValue, oldValue ) {
                this.set('filteredRows', this.get('rows'));
                if(filterValue !== '') {
                    var rows = this.get('filteredRows');
                    var selectedColumn = this.get('sortByColumn');
                    this.set('filteredRows', _.filter(rows, function(col, key) {
                        var colVal = (isNaN(col[selectedColumn])) ? col[selectedColumn].toLowerCase() : "" + col[selectedColumn];
                        if(colVal.indexOf(filterValue.toLowerCase()) > -1) {
                            return true;
                        }
                    }));
                }
            });
        },
        sortBy: function(column) {
            if(Object.keys(this.get('columns')).length === 0 || !this.get('columns')[column].sortable) {
                return;
            }
            this.set('reverse', !this.get('reverse'));
            this.set('sortByColumn', column); 
            var items = _.sortBy(this.get('rows'), item => {
                return (_.isNumber(item[column])) ? item[column] : item[column].toLowerCase();
            });
            this.set('rows', (!this.get('reverse')) ? items.reverse() : items);
        }
    });


})(window, Ractive);
