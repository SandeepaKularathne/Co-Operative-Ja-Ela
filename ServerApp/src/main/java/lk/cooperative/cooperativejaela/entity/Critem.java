package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.cooperative.cooperativejaela.util.RegexPattern;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
public class Critem {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "qty")
    @RegexPattern(reg = "^\\d+$", msg = "Invalid Qty.")
    private BigDecimal qty;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "customerreturn_id", referencedColumnName = "id", nullable = false)
    private Customerreturn customerreturn;
    @ManyToOne
    @JoinColumn(name = "Item_id", referencedColumnName = "id", nullable = false)
    private Item item;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Critem critem = (Critem) o;
        return id == critem.id && Objects.equals(qty, critem.qty);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, qty);
    }

    public Customerreturn getCustomerreturn() {
        return customerreturn;
    }

    public void setCustomerreturn(Customerreturn customerreturn) {
        this.customerreturn = customerreturn;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }
}
