package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Supreitem {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "qty")
    private Integer qty;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "supreturn_id", referencedColumnName = "id", nullable = false)
    private Supreturn supreturn;
    @ManyToOne
    @JoinColumn(name = "Item_id", referencedColumnName = "id", nullable = false)
    private Item item;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Supreitem supreitem = (Supreitem) o;
        return id == supreitem.id && Objects.equals(qty, supreitem.qty);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, qty);
    }

    public Supreturn getSupreturn() {
        return supreturn;
    }

    public void setSupreturn(Supreturn supreturn) {
        this.supreturn = supreturn;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }
}
