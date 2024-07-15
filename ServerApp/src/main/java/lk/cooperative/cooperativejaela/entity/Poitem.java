package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
public class Poitem {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "qty")
    private String qty;
    @Basic
    @Column(name = "explinetotal")
    private BigDecimal explinetotal;

    @ManyToOne
    @JoinColumn(name = "Item_id", referencedColumnName = "id", nullable = false)
    private Item item;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "purorder_id", referencedColumnName = "id", nullable = false)
    private Purorder purorder;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getQty() {
        return qty;
    }

    public void setQty(String qty) {
        this.qty = qty;
    }

    public BigDecimal getExplinetotal() {
        return explinetotal;
    }

    public void setExplinetotal(BigDecimal explinetotal) {
        this.explinetotal = explinetotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Poitem poitem = (Poitem) o;
        return id == poitem.id && Objects.equals(qty, poitem.qty) && Objects.equals(explinetotal, poitem.explinetotal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, qty, explinetotal);
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Purorder getPurorder() {
        return purorder;
    }

    public void setPurorder(Purorder purorder) {
        this.purorder = purorder;
    }
}
