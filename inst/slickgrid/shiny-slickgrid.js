$(function(){ //DOM Ready

  // Transpose a 2-dimensional array. Assumes that the array is rectangular -
  // probably won't do the right thing if some rows are shorter.
  function transpose(a) {
    // Treat 'a' as a column-first array, 'b' as a row-first array
    var cols = a.length;
    var rows = a[0].length;
    var b = new Array(rows);
    var i, j;

    for (i = 0; i < rows; i++) {
      b[i] = new Array(cols);
      for (j = 0; j < cols; j++) {
        b[i][j] = a[j][i];
      }
    }
    return b;
  }

  // Convert a column-first 2D array to a row-first array of objects with
  // named entries.
  function transposeToRowObj(ar, colnames) {
    if (ar.length !== colnames.length)
      throw "Number of columns doesn't match number of column names";

    // Treat ar as a column-first array, t as a row-first array
    var cols = ar.length;
    var rows = ar[0].length;
    var t = new Array(rows);
    var i, j;

    for (i = 0; i < rows; i++) {
      t[i] = {};
      for (j = 0; j < cols; j++) {
        t[i][colnames[j]] = ar[j][i];
      }
    }
    return t;
  }


  var slickgridOutputBinding = new Shiny.OutputBinding();
  $.extend(slickgridOutputBinding, {
    find: function(scope) {
      return $(scope).find('.shiny-slickgrid-output');
    },
    onValueError: function(el, err) {
      Shiny.unbindAll(el);
      this.renderError(el, err);
    },
    renderValue: function(el, data) {
      var cols = [],
          colname;
      for (var i=0; i < data.colnames.length; i++) {
        colname = data.colnames[i];
        cols[i] = { id: colname, name: colname, field: colname };
      }

      var options = {
        enableCellNavigation: true,
        enableColumnReorder: false
      };

      // data.values is a column-first 2D array; need to convert it
      var dataobj = transposeToRowObj(data.values, data.colnames);

      var grid = new Slick.Grid($(el), dataobj, cols, options);
    }
  });
  Shiny.outputBindings.register(slickgridOutputBinding, 'shiny.slickgridOutput');

});
