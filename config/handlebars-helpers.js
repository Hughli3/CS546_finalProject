module.exports = {
    pagination: function(totalPage, currentPage, block){
      if (totalPage <= 1) return null;

      if (currentPage == 1) block.data.previousPage = null;
      else block.data.previousPage = currentPage - 1;

      if (currentPage == totalPage) block.data.nextPage = null;
      else block.data.nextPage = currentPage + 1;

      return block.fn(this);
    },
    paginationItem: function(totalPage, currentPage, block){
        let minPage = Math.max(currentPage - 2, 1);
        let maxPage = Math.min(currentPage + 2, totalPage);

        let accum = '';
        for(let i = minPage; i <= maxPage; ++i) {
            if (i == currentPage) block.data.active = "active";
            else block.data.active = null;
            block.data.page = i;
            accum += block.fn(this);
        }
        return accum;
    }
  }