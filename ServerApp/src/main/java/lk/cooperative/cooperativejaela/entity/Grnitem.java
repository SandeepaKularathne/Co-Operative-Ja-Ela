package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.cooperative.cooperativejaela.util.RegexPattern;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
public class Grnitem {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "unitcost")
    @RegexPattern(reg = "^[0-9]+(\\.[0-9]{1,2})?$", msg = "Invalid price format.")
    private BigDecimal unitcost;
    @Basic
    @Column(name = "qty")
    @RegexPattern(reg = "^[0-9]+$", msg = "Invalid Qty.")
    private Integer qty;
    @Basic
    @Column(name = "linecost")
    private BigDecimal linecost;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id", nullable = false)
    private Grn grn;
    @ManyToOne
    @JoinColumn(name = "Item_id", referencedColumnName = "id", nullable = false)
    private Item item;

    @ManyToOne
    @JoinColumn(name = "store_id", referencedColumnName = "id", nullable = false)
    private Store store;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BigDecimal getUnitcost() {
        return unitcost;
    }

    public void setUnitcost(BigDecimal unitcost) {
        this.unitcost = unitcost;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public BigDecimal getLinecost() {
        return linecost;
    }

    public void setLinecost(BigDecimal linecost) {
        this.linecost = linecost;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Grnitem grnitem = (Grnitem) o;
        return id == grnitem.id && Objects.equals(unitcost, grnitem.unitcost) && Objects.equals(qty, grnitem.qty) && Objects.equals(linecost, grnitem.linecost);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, unitcost, qty, linecost);
    }

    public Grn getGrn() {
        return grn;
    }

    public void setGrn(Grn grn) {
        this.grn = grn;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }
}
